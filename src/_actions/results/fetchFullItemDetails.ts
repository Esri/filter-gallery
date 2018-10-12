import * as all from "dojo/promise/all";
import * as Deferred from "dojo/Deferred";
import { FilterGalleryState } from "../../_reducer";
import { fetchUser, mixinItemInfo, mixinUserInfo, requestJSON } from "../../_utils/index";
import { Pojo } from "../../Component";

export const UPDATE_FULL_ITEM_DETAILS = "UPDATE_FULL_ITEM_DETAILS";
export const FETCHING_FULL_ITEM_DETAILS = "FETCHING_FULL_ITEM_DETAILS";
export const FETCH_FULL_ITEM_DETAILS_FAILED = "FETCH_FULL_ITEM_DETAILS_FAILED";

export const updateFullItemDetails = (item: Pojo, owner: Pojo) => ({
    type: UPDATE_FULL_ITEM_DETAILS,
    payload: {
        item,
        owner
    }
});

export const fetchFullItemDetailsFailed = (id: string) => ({
    type: FETCH_FULL_ITEM_DETAILS_FAILED,
    payload: id
});

export const fetchFullItemDetails = (item: Pojo) => (dispatch: any, getState: () => FilterGalleryState) => {
    const state = getState();
    const { portal, request } = state.settings.utils;

    const requests = [];

    requests.push(
        fetchUser(request, portal, item.owner)
            .then(
                (user: Pojo) => mixinUserInfo(portal, user),
                (err: any) => { throw (err); }
            )
    );

    let url = `${portal.restUrl}/content/items/${item.id}`;
    if (portal.user && item.owner === portal.user.username) {
        const username = portal.user.username;
        url = `${portal.restUrl}/content/users/${username}/items/${item.id}`;
    }

    requests.push(
        requestJSON(request, url)
            .then(
                (response: any) => {
                    if (!!response.item && !!response.sharing) {
                        const dfd = new Deferred();
                        requestJSON(
                            request,
                            `${portal.restUrl}/community/groups`,
                            {
                                q: `id: ${response.sharing.groups.map((group: string) => `"${group}"`).join(" OR ")}`
                            }
                        ).then(
                            (response2: any) => {
                                return dfd.resolve({
                                    ...mixinItemInfo(portal, state.settings.utils.iconDir, response.item),
                                    sharing: response.sharing,
                                    sharedToGroups: response2.results
                                });
                            },
                            (err: any) => dfd.reject(err)
                        );
                        return dfd;
                    } else {
                        return mixinItemInfo(portal, state.settings.utils.iconDir, response);
                    }
                },
                (err: any) => {
                    throw item.id;
                }
            )
    );

    all(requests as any)
        .then(
            (results) => { dispatch(updateFullItemDetails(results[1], results[0])); },
            (id) => { dispatch({ type: FETCH_FULL_ITEM_DETAILS_FAILED, payload: id }); }
        );
};
