import { getSearchRequest } from "../results/_utils/requestHelpers";
import { FilterGalleryState } from "../../_reducer";
import { mixinItemInfo } from "../../_utils";
import { mixinOrganizationInfo } from "../results/allOrganizations";
import { Pojo } from "../../Component";

export const CHANGE_PAGE_SUCCESS = "CHANGE_PAGE_SUCCESS";
export const CHANGE_PAGE_FAIL = "CHANGE_PAGE_FAIL";
export const CHANGING_PAGE = "CHANGING_PAGE";

export const changePage = (page: number) => (dispatch: any, getState: () => FilterGalleryState) => {
    const state = getState();

    dispatch({
        type: CHANGING_PAGE,
        payload: page
    });
    const { portal, iconDir } = state.settings.utils;
    const request = state.settings.utils.request;
    const perPage = state.settings.config.resultsPerQuery;
    const neededItems = perPage * page - perPage;
    const [ url, parameters ] = getSearchRequest({ num: perPage, start: neededItems }, state);
    request(url, parameters).then(
        mixinOrganizationInfo(state),
        (err: any) => dispatch({ type: CHANGE_PAGE_FAIL, payload: { err } })
    ).then(
        (response: any) => {
            dispatch({
                type: CHANGE_PAGE_SUCCESS,
                payload: {
                    organizations: response.data.organizations,
                    displayItems: response.data.results
                        .map((item: Pojo) => mixinItemInfo(portal, iconDir, item)),
                    page
                }
            });
        },
        (err: any) => dispatch({ type: CHANGE_PAGE_FAIL, payload: { err } })
    );
};
