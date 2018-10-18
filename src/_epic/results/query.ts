import { Subject, Observable, of } from "rxjs";
import { Action, combineEpics, ofType, Pojo } from "../../Component";
import { FilterGalleryState } from "../../_reducer";
import { withLatestFrom, switchMap, take, startWith, map, catchError, filter, tap } from "rxjs/operators";
import {
    SEARCH,
    SIGNED_IN,
    SIGNED_OUT,
    UPDATE_SECTION_INFO_SUCCESS,
    mixinOrganizationInfo,
    LOADING_CONTENT_SUCCESS,
    LOADING_CONTENT_FAILED,
    LOADING_SECTION_INFO,
    LOADING_CONTENT,
    UPDATE_USER_INFO_SUCCESS,
    LOADING_USER_INFO,
    LOAD_PORTAL_SUCCESS
} from "../../_actions";
import { getSearchRequest, getCountsRequest, getTagsRequest } from "../../_actions/results/_utils/requestHelpers";
import * as all from "dojo/promise/all";
import { fromDeferred, mixinItemInfo } from "../../_utils";

export const searchEpic = (action$: Subject<Action>) => action$.pipe(
    ofType(SEARCH, SIGNED_IN, SIGNED_OUT, LOAD_PORTAL_SUCCESS),
    map(({ type, payload }) => ({
        type: LOADING_CONTENT,
        payload:
            (type === SEARCH && payload === true) ||
            type === SIGNED_IN ||
            type === SIGNED_OUT ||
            type === LOAD_PORTAL_SUCCESS
    }))
);

export const loadingContentEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(LOADING_CONTENT),
    withLatestFrom(state$),
    filter(([, state]) => state.settings.utils.portal.loadStatus === "loaded"),
    switchMap(([action, state]: [Action, FilterGalleryState]) => {
        const updateCounts = action.payload;
        const portal: __esri.Portal = state.settings.utils.portal as any;
        const user = state.settings.utils.portal.user;
        const loggedIn = !!user;

        if (loggedIn && state.results.user.status === "initial") {
            // User is logged in, but don't yet have their information in state.
            // Need to fetch the section and user information prior to searching.
            return action$.pipe(
                ofType(UPDATE_SECTION_INFO_SUCCESS, UPDATE_USER_INFO_SUCCESS),
                withLatestFrom(state$),
                filter(
                    ([, { results }]) => results.user.status === "loaded" && results.section.status === "loaded"
                ),
                take(1),
                switchMap(([, newState]) => executeSearch(newState, updateCounts)),
                startWith({ type: LOADING_SECTION_INFO }, { type: LOADING_USER_INFO })
            );
        } else if (state.results.section.status === "initial") {
            // Don't yet have the information about the section being queried.
            // Need to fetch the section information prior to searching.
            return action$.pipe(
                ofType(UPDATE_SECTION_INFO_SUCCESS),
                withLatestFrom(state$),
                take(1),
                switchMap(([, newState]) => executeSearch(newState, updateCounts)),
                startWith({
                    type: LOADING_SECTION_INFO
                })
            );
        } else if (state.results.section.status === "failed" || state.results.user.status === "failed") {
            return of({
                type: LOADING_CONTENT_FAILED,
                payload: "Failed to retrieve user/section info"
            });
        } else {
            return executeSearch(state, updateCounts);
        }
    })
);

export default combineEpics(
    searchEpic,
    loadingContentEpic
);

function executeSearch(state: FilterGalleryState, updateCounts: boolean) {
    const request = state.settings.utils.request;
    const [url, parameters] = getSearchRequest({}, state);

    const searchRequest = request(url, parameters) // Primary request
        .then(
            mixinOrganizationInfo(state)
        );

    let countsRequest1; // Need 2 requests for counts because of server-side 3 field limit
    let countsRequest2;
    if (!!updateCounts) {
        const [countUrl1, countParameters1] = getCountsRequest(
            state, [
                "access",
                "contentstatus",
                state.settings.config.useOrgCategories && !!state.settings.utils.portal.id ?
                    "categories" :
                    "groupcategories"
            ]
        );
        countsRequest1 = request(countUrl1, countParameters1);

        const [countUrl2, countParameters2] = getTagsRequest(state, state.ui.tagsFilter.filterString);
        countsRequest2 = request(countUrl2, countParameters2);
    }

    const requests = [searchRequest, countsRequest1, countsRequest2]
        .filter((req: any) => !!req); // Remove inapplicable requests

    return fromDeferred<any[]>(all(requests as any) as any).pipe(
        map((responses) => handleSearchResponse(state, responses)),
        catchError(err => of({
            type: LOADING_CONTENT_FAILED,
            payload: err
        }))
    );
}

function handleSearchResponse(state: FilterGalleryState, responses: any[]) {
    const imgDir = state.settings.utils.iconDir;
    const portal = state.settings.utils.portal;
    return {
        type: LOADING_CONTENT_SUCCESS,
        payload: {
            search: {
                ...responses[0].data,
                results: responses[0].data.results.map((item: Pojo) => mixinItemInfo(portal, imgDir, item))
            }, // Add the search results to payload
            aggregations: (
                responses[1] && responses[1].data && responses[1].data.aggregations
            ) ? { // If counts were retrieved, add them to the payload as well
                    counts: [...responses[1].data.aggregations.counts]
                        .concat( // If counts for tags were received, add those to the payload as well
                            responses[2] && responses[2].data && responses[2].data.aggregations ?
                                [...responses[2].data.aggregations.counts] : []
                        )
                } : undefined
        }
    };
}
