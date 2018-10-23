import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { LOADING_USER_INFO, UPDATE_USER_INFO_FAILED, UPDATE_USER_INFO_SUCCESS, ADD_TO_FAVORITES, ADD_TO_FAVORITES_SUCCESS, ADD_TO_FAVORITES_FAIL, REMOVE_FROM_FAVORITES, REMOVE_FROM_FAVORITES_SUCCESS, REMOVE_FROM_FAVORITES_FAIL } from "../../_actions";
import { Subject, Observable, of } from "rxjs";
import { Action, ofType, Pojo, combineEpics } from "../../Component";
import { FilterGalleryState } from "../../_reducer";

import * as all from "dojo/promise/all";
import { fetchGroupById, fetchGroupCategorySchema, fromDeferred, fetchUser, fetchUserContent, fetchUserFavorites, requestJSON } from "../../_utils";

const userInfoEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOADING_USER_INFO),
    switchMap(() => {
        const state = getState();
        const { request, portal } = state.settings.utils;

        const requests = all([
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

        return fromDeferred(requests as any).pipe(
            map((responses) => ({
                type: UPDATE_USER_INFO_SUCCESS,
                payload: {
                    groups: responses[0],
                    folders: responses[1],
                    favorites: responses[2]
                }
            })),
            catchError((err) => of({ type: UPDATE_USER_INFO_FAILED, payload: err }))
        );
    })
);

const addFavoriteEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(ADD_TO_FAVORITES),
    mergeMap(({ payload }) => {
        const state = getState();
        const item = payload;
        const { portal, request } = state.settings.utils;
        const favGroupId = portal.user.favGroupId;
        const url = `${portal.restUrl}/content/items/${item.id}/share`;
        const everyone = (item.access && item.access === "public") ||
            (item.sharing && item.sharing.access && item.sharing.access === "public");
        const org = (item.access && item.access === "org") ||
            (item.sharing && item.sharing.access && item.sharing.access === "org");
        const query = {
            f: "json",
            everyone,
            org,
            groups: [favGroupId],
            items: [item.id]
        };
        return fromDeferred(request(url, { method: "post", query })).pipe(
            map(() => ({ type: ADD_TO_FAVORITES_SUCCESS, payload: item })),
            catchError(() => of({ type: ADD_TO_FAVORITES_FAIL, payload: item }))
        );
    })
);

const removeFavoriteEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(REMOVE_FROM_FAVORITES),
    mergeMap(({ payload }) => {
        const state = getState();
        const item = payload;
        const { portal, request } = state.settings.utils;
        const favGroupId = portal.user.favGroupId;
        const url = `${portal.restUrl}/content/items/${item.id}/unshare`;
        const query = {
            f: "json",
            everyone: false,
            org: false,
            groups: [favGroupId],
            items: [item.id]
        };
        return fromDeferred(request(url, { method: "post", query })).pipe(
            map(() => ({ type: REMOVE_FROM_FAVORITES_SUCCESS, payload: item })),
            catchError(() => of({ type: REMOVE_FROM_FAVORITES_FAIL, payload: item }))
        );
    })
);

export default combineEpics(
    userInfoEpic,
    addFavoriteEpic,
    removeFavoriteEpic
);
