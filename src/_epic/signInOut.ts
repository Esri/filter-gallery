import { combineEpics, Action } from "../Component";
import { Subject, Observable } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { SIGN_IN, SIGNED_IN, SIGN_OUT, SIGNED_OUT } from "../_actions";
import { filter, switchMap, map } from "rxjs/operators";

import * as Portal from "esri/portal/Portal";
import { fromDeferred, getOrgBaseUrl } from "../_utils";

export const signInEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    filter(({ type }) => type === SIGN_IN),
    switchMap(() => {
        const portal = new Portal();
        portal.authMode = "immediate";
        portal["baseUrl"] = getOrgBaseUrl(portal);
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: SIGNED_IN, payload: portal }))
        );
    })
);

export const signOutEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    filter(({ type }) => type === SIGN_OUT),
    switchMap(() => {
        const portal = new Portal();
        portal.authMode = "anonymous";
        portal["baseUrl"] = getOrgBaseUrl(portal);
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: SIGNED_OUT, payload: portal }))
        );
    })
);

export default combineEpics(
    signInEpic,
    signOutEpic
);