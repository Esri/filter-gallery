import { Subject, Observable, of } from "rxjs";
import { Action, Pojo, ofType } from "../../Component";
import { FilterGalleryState } from "../../_reducer";
import { withLatestFrom, map, catchError, switchMap } from "rxjs/operators";
import { CHANGING_PAGE, mixinOrganizationInfo, CHANGE_PAGE_SUCCESS, CHANGE_PAGE_FAIL } from "../../_actions";
import { getSearchRequest } from "../../_actions/results/_utils/requestHelpers";
import { fromDeferred, mixinItemInfo } from "../../_utils";

export default (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(CHANGING_PAGE),
    withLatestFrom(state$),
    switchMap(([ { payload }, state ]) => {
        const { portal, iconDir } = state.settings.utils;
        const request = state.settings.utils.request;
        const perPage = state.settings.config.resultsPerQuery;
        const neededItems = perPage * payload - perPage;
        const [ url, parameters ] = getSearchRequest({ num: perPage, start: neededItems }, state);

        return fromDeferred(request(url, parameters)).pipe(
            switchMap((searchResponse) => fromDeferred<any>(mixinOrganizationInfo(state, searchResponse)).pipe(
                map((response) => ({
                    type: CHANGE_PAGE_SUCCESS,
                    payload: {
                        organization: response.data.organizations,
                        displayItems: response.data.results
                            .map((item: Pojo) => mixinItemInfo(portal, iconDir, item)),
                        page: payload
                    }
                })),
                catchError((err) => of({ type: CHANGE_PAGE_FAIL, payload: { err } }))
            )),
            catchError((err) => of({ type: CHANGE_PAGE_FAIL, payload: { err } }))
        );
    })
);