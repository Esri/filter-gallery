import { Action, ofType, combineEpics } from "../Component";
import { Subject, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { LOAD_PORTAL, LOAD_PORTAL_SUCCESS, LOAD_PORTAL_FAILED, 
    AUTHENTICATION_FAILED, ORIGIN_FAILED, BROWSER_FAILED } from "../_actions";
import { switchMap, map, catchError, tap } from "rxjs/operators";

import { fromDeferred } from "../_utils";



export const baseEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOAD_PORTAL),
    switchMap(() => {
        const base = getState().settings.utils.base;
        return fromDeferred(base.load() as any).pipe(
            switchMap(() => {
                if (base["isIE"]) {
                    const err = "isIE" as any as Error;
                    const pay = { base: base, err: err };
                    return of({ type: BROWSER_FAILED, payload: pay });
                }
                return fromDeferred(base.portal.load()).pipe(
                    map(() => ({ type: LOAD_PORTAL_SUCCESS, payload: base })),
                    catchError((err) => {
                        return of({ type: LOAD_PORTAL_FAILED, payload: err });
                    })
                );
            }),
            catchError((err: Error) => {
                if (err === "identity-manager:not-authorized" as any as Error) {
                    return of({ type: AUTHENTICATION_FAILED, payload: err });
                } else if  (err === "application:origin-other" as any as Error) {
                    return of({ type: ORIGIN_FAILED, payload: err });
                }
                return of({ type: LOAD_PORTAL_FAILED, payload: err });
            })
        );
    })
);

export default combineEpics(
    baseEpic
);
