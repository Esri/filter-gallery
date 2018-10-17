import { Subject } from "rxjs";
import { Action, ofType, combineEpics } from "../../Component";
import { map, delay, filter, tap } from "rxjs/operators";
import {
    CLOSE_VIEWER,
    CLOSE_VIEWER_IMMEDIATE,
    VIEW_IN_MAP,
    VIEW_IN_SCENE,
    VIEW_ITEM_DETAILS,
    VIEW_MAP,
    VIEW_SCENE
} from "../../_actions";

export const closeViewerEpic = (action$: Subject<Action>) => action$.pipe(
    ofType(CLOSE_VIEWER),
    tap(() => document.body.style.overflowY = "scroll"),
    delay(300),
    map(() => ({ type: CLOSE_VIEWER_IMMEDIATE }))
);

export const openViewerEpic = (action$: Subject<Action>) => action$.pipe(
    ofType(VIEW_IN_MAP, VIEW_IN_SCENE, VIEW_ITEM_DETAILS, VIEW_MAP, VIEW_SCENE),
    delay(300),
    tap(() => document.body.style.overflowY = "hidden"),
    filter(() => false)
);

export default combineEpics(
    closeViewerEpic,
    openViewerEpic
);
