import { Action, ofType, combineEpics } from "../Component";
import { Subject, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { LOAD_PORTAL, LOAD_PORTAL_SUCCESS, LOAD_PORTAL_FAILED, 
    AUTHENTICATION_FAILED, ORIGIN_FAILED, OriginError } from "../_actions";
import { switchMap, map, catchError, tap } from "rxjs/operators";

import { fromDeferred } from "../_utils";

export const baseEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOAD_PORTAL),
    switchMap((action) => {
        const base = getState().settings.utils.base;
        const updateSection = action.payload?.updateSection || false;
        return fromDeferred(
            base.load().then(
                () => {
                    base.loadConfig();
                    return base;
                }
            ) as any).pipe(
            switchMap(() => fromDeferred(base.portal.load()).pipe(
                map(() => ({ type: LOAD_PORTAL_SUCCESS, payload: {...base, updateSection} })),
                catchError((err) => {
                    return of({ type: LOAD_PORTAL_FAILED, payload: err });
                })
            )),
            catchError((err: Error | OriginError) => {
                if (err === "identity-manager:not-authorized" as any as Error) {
                    return of({ type: AUTHENTICATION_FAILED, payload: err });
                } else if  ((err as OriginError).error === "application:origin-other") {
                    return of({ type: ORIGIN_FAILED, payload: (err as OriginError) });
                }
                return of({ type: LOAD_PORTAL_FAILED, payload: err });
            })
        );
    })
);

export default combineEpics(
    baseEpic
);
