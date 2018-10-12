import * as all from "dojo/promise/all";
import * as Deferred from "dojo/Deferred";
import { FilterGalleryState } from "../../_reducer";
import {
    fetchGroupCategorySchema,
    fetchUser,
    fetchUserContent,
    fetchUserFavorites
} from "../../_utils/index";
import { Pojo } from "../../Component";

export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
export const ADD_TO_FAVORITES_SUCCESS = "ADD_TO_FAVORITES_SUCCESS";
export const ADD_TO_FAVORITES_FAIL = "ADD_TO_FAVORITES_FAIL";
export const LOADING_USER_INFO = "LOADING_USER_INFO";
export const UPDATE_GROUP_CATEGORIES = "UPDATE_GROUP_CATEGORIES";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const UPDATE_USER_INFO_FAILED = "UPDATE_USER_INFO_FAILED";
export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";
export const REMOVE_FROM_FAVORITES_SUCCESS = "REMOVE_FROM_FAVORITES_SUCCESS";
export const REMOVE_FROM_FAVORITES_FAIL = "REMOVE_FROM_FAVORITES_FAIL";

export const fetchUserInfo = () => (dispatch: any, getState: () => FilterGalleryState) => {
    const state = getState();

    if (state.results.user.status === "loaded") {
        return (new Deferred).resolve();
    } else if (state.results.user.status === "failed") {
        return (new Deferred).reject();
    }

    dispatch({ type: LOADING_USER_INFO });

    const { request, portal } = state.settings.utils;

    return all([
        fetchUser(request, portal).then((response: any) => {
            return response.groups.map((group: Pojo) => ({
                id: group.id,
                title: group.title
            }));
        }),
        fetchUserContent(request, portal).then((response: any) => {
            return response.folders.map((folder: Pojo) => ({
                id: folder.id,
                title: folder.title
            }));
        }),
        fetchUserFavorites(request, portal, portal.user.favGroupId).then((response: any) => {
            return response.items.reduce((result: Pojo, current: Pojo) => {
                result[current.id] = true;
                return result;
            }, {});
        })
    ]);
};

export const fetchUserGroupCategorySchema = (id: string) => (dispatch: any, getState: () => FilterGalleryState) => {
    const { request, portal } = getState().settings.utils;
    return fetchGroupCategorySchema(request, portal, id).then(({ categorySchema }: any) => {
        dispatch({
            type: UPDATE_GROUP_CATEGORIES,
            payload: { id, categorySchema }
        });
    });
};

export const addToFavorites = (item: Pojo) => (dispatch: any, getState: () => FilterGalleryState) => {
    let state = getState();
    const portal = state.settings.utils.portal as any;
    const favGroupId = portal.user.favGroupId;
    const url = `${portal.restUrl}/content/items/${item.id}/share`;
    const everyone = (item.access && item.access === "public") ||
        (item.sharing && item.sharing.access && item.sharing.access === "public");
    const org = (item.access && item.access === "org") ||
        (item.sharing && item.sharing.access && item.sharing.access === "org") || false;
    const query = {
        f: "json",
        everyone,
        org,
        groups: [favGroupId],
        items: [item.id]
    };

    dispatch({
        type: ADD_TO_FAVORITES,
        payload: item
    });

    state.settings.utils.request(
        url, { method: "post", query }
    ).then(
        (response: any) => {
            dispatch({
                type: ADD_TO_FAVORITES_SUCCESS,
                payload: item
            });
        },
        (err: Error) => {
            console.error(err);
            dispatch({
                type: ADD_TO_FAVORITES_FAIL,
                payload: item
            });
        }
    );
};

export const removeFromFavorites = (item: Pojo) => (dispatch: any, getState:() => FilterGalleryState) => {
    let state = getState();
    const portal = state.settings.utils.portal as any;
    const favGroupId = portal.user.favGroupId;
    const url = `${portal.restUrl}/content/items/${item.id}/unshare`;
    const query = {
        f: "json",
        everyone: false,
        org: false,
        groups: [favGroupId],
        items: [item.id]
    };

    dispatch({
        type: REMOVE_FROM_FAVORITES,
        payload: item
    });

    state.settings.utils.request(
        url, { method: "post", query }
    ).then(
        (response: any) => {
            dispatch({
                type: REMOVE_FROM_FAVORITES_SUCCESS,
                payload: item
            });
        },
        (err: Error) => {
            dispatch({
                type: REMOVE_FROM_FAVORITES_FAIL,
                payload: item
            });
        });
};
