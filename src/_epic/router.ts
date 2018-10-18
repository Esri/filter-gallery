import * as ioQuery from "dojo/io-query";

import { Action, ofType, combineEpics } from "../Component";
import { Subject, Observable } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { HASH_CHANGE, CLOSE_VIEWER, closeViewer } from "../_actions";
import { switchMap, withLatestFrom, filter, map } from "rxjs/operators";

import { fromDeferred } from "../_utils";

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

export const closeViewerEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(HASH_CHANGE),
    withLatestFrom(state$),
    filter(([action, state]) => {
        const query = ioQuery.queryToObject(action.payload);
        return !query.viewType && !!state.ui.viewer.open && !state.ui.viewer.closing;
    }),
    map(([]) => ({ type: CLOSE_VIEWER }))
);

// export const loadItemEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
//     ofType(HASH_CHANGE),
//     withLatestFrom(state$),
//     switchMap(([, state]) => {
//     })
// );

export default combineEpics(
    viewItemEpic,
    closeViewerEpic
    // loadItemEpic
);
