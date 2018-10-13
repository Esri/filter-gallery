import { FilterGalleryState } from "../../_reducer/index";
import { getCountsRequest, getSearchRequest, getTagsRequest } from "./_utils/requestHelpers";
import { mixinOrganizationInfo } from "./allOrganizations";
import * as all from "dojo/promise/all";
import { mixinItemInfo } from "../../_utils/index";
import {
    fetchSectionInfo,
    fetchUserInfo
} from "..";
import { Pojo } from "../../Component";

export const LOADING_CONTENT = "LOADING_CONTENT";
export const LOADING_CONTENT_SUCCESS = "LOADING_CONTENT_SUCCESS";
export const LOADING_CONTENT_FAILED = "LOADING_CONTENT_FAILED";

/**
 * Action creator for starting a new search based on the current state
 * @param updateCounts - indicates whether or not to also fetch count aggregations alongside this query
 */
export const search = (updateCounts?: boolean) => (dispatch: any, getState: () => FilterGalleryState) => {
    dispatch({ type: LOADING_CONTENT });
    dispatch(attemptSearch(updateCounts));
};

/**
 * Action creator for attempting a query against a portal
 * @param updateCounts - indicates whether or not to also fetch count aggregations alongside this query
 */
const attemptSearch = (updateCounts?: boolean) => (dispatch: any, getState: () => FilterGalleryState) => {
    let state = getState();
    const user = state.settings.utils.portal.user;
    const loggedIn = !!user;

    if (loggedIn) {
        all([ dispatch(fetchSectionInfo()), dispatch(fetchUserInfo()) ])
            .then(
                () => executeSearch(dispatch, getState(), updateCounts),
                () => dispatch({ type: LOADING_CONTENT_FAILED, payload: "Couldn't load the section or user info." })
            );
    } else {
        dispatch(fetchSectionInfo())
            .then(
                () => executeSearch(dispatch, getState(), updateCounts),
                () => dispatch({ type: LOADING_CONTENT_FAILED, payload: "Couldn't load the section info." })
            );
    }
};

/**
 * Performs the search requests once all required state is available
 * @param dispatch - dispatch function for the store
 * @param state - current state of the item browser
 * @param updateCounts - boolean indicating whether or not to update the counts
 */
function executeSearch(dispatch: any, state: FilterGalleryState, updateCounts?: boolean) {
    const request = state.settings.utils.request;
    const [url, parameters] = getSearchRequest({}, state);

    const searchRequest = request(url, parameters) // Primary request
        .then(
            mixinOrganizationInfo(state),
            (err: any) => dispatch({ type: LOADING_CONTENT_FAILED, payload: err })
        );

    let countsRequest1; // Need 2 requests for counts because of server-side 3 field limit
    let countsRequest2;
    if (!!updateCounts) {
        const [countUrl1, countParameters1] = getCountsRequest(state, ["access", "contentstatus", "groupcategories"]);
        countsRequest1 = request(countUrl1, countParameters1);

        const [countUrl2, countParameters2] = getTagsRequest(state, state.ui.tagsFilter.filterString);
        countsRequest2 = request(countUrl2, countParameters2);
    }

    const requests = [searchRequest, countsRequest1, countsRequest2]
        .filter((req: any) => !!req); // Remove inapplicable requests

    all(requests as any)
        .then(
            (responses: any) => dispatch(handleSearchResponse(state, responses)),
            (err: any) => dispatch({ type: LOADING_CONTENT_FAILED, payload: err })
        );
}

/**
 * Action creator for handling a successful search response
 * @param state - current state of the item browser
 * @param responses - array of search and counts responses
 */
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
