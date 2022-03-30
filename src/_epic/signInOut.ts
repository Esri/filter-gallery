import { combineEpics, Action } from "../Component";
import { Subject, of } from "rxjs";
import { FilterGalleryState } from "../_reducer";
import { SIGN_IN, SIGNED_IN, SIGN_OUT, SIGNED_OUT, SIGN_IN_FAILED, SIGN_OUT_FAILED } from "../_actions";
import { filter, switchMap, map, catchError } from "rxjs/operators";

import Portal = require("esri/portal/Portal");
import IdentityManager = require("esri/identity/IdentityManager");
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

        localStorage.removeItem("_AGO_SESSION_");
        const mpUrl = new URL("../", window.location.href).href;
        window.location.href = `${portal.restUrl}/oauth2/signout?client_id=${state.settings.config.oauthappid}&redirect_uri=${mpUrl}`;

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