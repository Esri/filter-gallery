import * as ioQuery from "dojo/io-query";

import { Action, ofType, combineEpics } from "../Component";
import { Subject, Observable, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { HASH_CHANGE, closeViewer, LOADED_ITEM, LOAD_ITEM_FAILED, loadedItem } from "../_actions";
import { switchMap, withLatestFrom, filter, map, catchError } from "rxjs/operators";

import { fromDeferred, fetchItemById } from "../_utils";

/**
 * When the hash change corresponds with viewing an item which has already been loaded, open the viewer.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const viewItemEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(HASH_CHANGE),
    withLatestFrom(state$),
    filter(([action, state]) => {
        const query = ioQuery.queryToObject(action.payload);
        return !!query.viewType && !state.ui.viewer.open && !!state.results.loadedItems[query.viewId];
    }),
    map(([action, state]) => {
        const query = ioQuery.queryToObject(action.payload);
        return { type: query.viewType, payload: state.results.loadedItems[query.viewId] };
    })
);

/**
 * When the hash change corresponds with closing the viewer (and it's not already closing), close the viewer.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const closeViewerEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(HASH_CHANGE),
    withLatestFrom(state$),
    filter(([action, state]) => {
        const query = ioQuery.queryToObject(action.payload);
        return !query.viewType && !!state.ui.viewer.open && !state.ui.viewer.closing;
    }),
    map(([]) => closeViewer())
);

/**
 * When the hash change corresponds with viewing an item, but it has not already been loaded, load the item.
 * @param action$ - The action stream.
 * @param state$ - The state stream.
 */
export const loadItemEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(HASH_CHANGE),
    withLatestFrom(state$),
    filter(([action, state]) => {
        const query = ioQuery.queryToObject(action.payload);
        return !!query.viewType && !state.ui.viewer.open && !state.results.loadedItems[query.viewId];
    }),
    switchMap(([action, state]) => {
        const { request, portal } = state.settings.utils;
        const query = ioQuery.queryToObject(action.payload);
        return fromDeferred(fetchItemById(request, portal, query.viewId) as any).pipe(
            map(response => (loadedItem(response, query.viewType))),
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
export const loadedItemEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(LOADED_ITEM),
    map(({ payload }) => ({ type: payload.viewType, payload: payload.item }))
);

export default combineEpics(
    viewItemEpic,
    closeViewerEpic,
    loadItemEpic,
    loadedItemEpic
);
