import { Action, ofType } from "../Component";
import { Subject, Observable } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { LOAD_PORTAL, LOAD_PORTAL_SUCCESS } from "../_actions";
import { switchMap, map, withLatestFrom } from "rxjs/operators";

import * as Portal from "esri/portal/Portal";
import { fromDeferred } from "../_utils";

export default (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(LOAD_PORTAL),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const portal = state.settings.utils.portal;
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: LOAD_PORTAL_SUCCESS, payload: portal }))
        );
    })
);
