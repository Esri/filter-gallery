import { combineEpics, Action } from "../Component";
import { Subject, Observable, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { SIGN_IN, SIGNED_IN, SIGN_OUT, SIGNED_OUT, SIGN_IN_FAILED, SIGN_OUT_FAILED } from "../_actions";
import { filter, switchMap, map, withLatestFrom, catchError } from "rxjs/operators";

import * as Portal from "esri/portal/Portal";
import { fromDeferred, getOrgBaseUrl } from "../_utils";

export const signInEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    filter(({ type }) => type === SIGN_IN),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const portal = new Portal({ url: state.settings.config.url });
        portal.authMode = "immediate";
        portal["baseUrl"] = getOrgBaseUrl(portal);
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: SIGNED_IN, payload: portal })),
            catchError((err) => of({ type: SIGN_IN_FAILED, payload: { err } }))
        );
    })
);

export const signOutEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    filter(({ type }) => type === SIGN_OUT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const portal = new Portal({ url: state.settings.config.url });
        portal.authMode = "anonymous";
        portal["baseUrl"] = getOrgBaseUrl(portal);
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: SIGNED_OUT, payload: portal })),
            catchError((err) => of({ type: SIGN_OUT_FAILED, payload: { err } }))
        );
    })
);

export default combineEpics(
    signInEpic,
    signOutEpic
);