import ioQuery = require("dojo/io-query");

import { Action, ofType, combineEpics } from "../Component";
import { Subject, Observable, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { HASH_CHANGE, closeViewer, LOADED_ITEM, LOAD_ITEM_FAILED, loadedItem } from "../_actions";
import { switchMap, filter, map, catchError, tap } from "rxjs/operators";

import { fromDeferred, fetchItemById } from "../_utils";

/**
 * When the hash change corresponds with viewing an item which has already been loaded, open the viewer.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const viewItemEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(HASH_CHANGE),
    filter((action) => {
        const state = getState();
        const query = ioQuery.queryToObject(action.payload);
        return !!query.viewType && !state.ui.viewer.open && !!state.results.loadedItems[query.viewId];
    }),
    tap(() => {
        setTimeout(() => {
            const backBtn = document.getElementById("fg-back-btn");
            if (backBtn) {
                backBtn.focus();
            }
        }, 100);
    }),
    map((action) => {
        const state = getState();
        const query = ioQuery.queryToObject(action.payload);
        return { type: query.viewType, payload: state.results.loadedItems[query.viewId] };
    }),
);

/**
 * When the hash change corresponds with closing the viewer (and it's not already closing), close the viewer.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const closeViewerEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(HASH_CHANGE),
    filter((action) => {
        const state = getState();
        const query = ioQuery.queryToObject(action.payload);
        return !query.viewType && !!state.ui.viewer.open && !state.ui.viewer.closing;
    }),
    tap((action) => {
        const state = getState();
        const el = document.getElementById(state.ui.viewer.item.id);
        if (el) {
            el.scrollIntoView();
            const btn = el.querySelector(`#${state.ui.viewer.type}-${state.ui.viewer.item.id}`) as HTMLElement;
            if (btn) {
                btn.focus();
            }
        }
    }),
    map(() => closeViewer())
);

/**
 * When the hash change corresponds with viewing an item, but it has not already been loaded, load the item.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const loadItemEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(HASH_CHANGE),
    filter((action) => {
        const state = getState();
        const query = ioQuery.queryToObject(action.payload);
        return !!query.viewType && !state.ui.viewer.open && !state.results.loadedItems[query.viewId];
    }),
    switchMap((action) => {
        const state = getState();
        const { request, portal } = state.settings.utils;
        const query = ioQuery.queryToObject(action.payload);
        return fromDeferred(fetchItemById(request, portal, query.viewId) as any).pipe(
            map((response: any) => (loadedItem(response, query.viewType))),
            catchError(err => of({
                type: LOAD_ITEM_FAILED,
                payload: err
            }))
        );
    })
);

/**
 * When an item intended to be viewed is loaded, open it in the viewer.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const loadedItemEpic = (action$: Subject<Action>) => action$.pipe(
    ofType(LOADED_ITEM),
    map(({ payload }) => ({ type: payload.viewType, payload: payload.item }))
);

export default combineEpics(
    viewItemEpic,
    closeViewerEpic,
    loadItemEpic,
    loadedItemEpic
);
