import { combineEpics, Action } from "../Component";
import { Subject, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { SIGN_IN, SIGNED_IN, SIGN_OUT, SIGNED_OUT, SIGN_IN_FAILED, SIGN_OUT_FAILED } from "../_actions";
import { filter, switchMap, map, catchError } from "rxjs/operators";

import * as Portal from "esri/portal/Portal";
import * as IdentityManager from "esri/identity/IdentityManager";
import { fromDeferred, getOrgBaseUrl } from "../_utils";

export const signInEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    filter(({ type }) => type === SIGN_IN),
    switchMap(() => {
        const state = getState();
        const portal = new Portal({ url: state.settings.config.url });
        portal.authMode = "immediate";
        portal["baseUrl"] = getOrgBaseUrl(portal);
        return fromDeferred(portal.load() as any).pipe(
            map(() => ({ type: SIGNED_IN, payload: portal })),
            catchError((err) => of({ type: SIGN_IN_FAILED, payload: { err } }))
        );
    })
);

export const signOutEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    filter(({ type }) => type === SIGN_OUT),
    switchMap(() => {
        const state = getState();
        IdentityManager.destroyCredentials();
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