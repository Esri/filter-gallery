import { FilterGalleryStore } from "..";
import * as Portal from "esri/portal/Portal";
import { getOrgBaseUrl } from "../_utils";
import { FilterGalleryState } from "../_reducer";
import { search } from "./results";

export * from "./parameters/index";
export * from "./results/index";
export * from "./ui/index";

export const SIGNED_IN = "SIGNED_IN";
export const signIn = () => (dispatch: FilterGalleryStore["dispatch"], getState: () => FilterGalleryState) => {
    const portal = new Portal();
    portal.authMode = "immediate";
    portal.load().then(() => {
        portal["baseUrl"] = getOrgBaseUrl(portal);
        dispatch({ type: SIGNED_IN, payload: portal });
        dispatch(search(true));
    });
};

export const SIGNED_OUT = "SIGNED_OUT";
export const signOut = () => (dispatch: FilterGalleryStore["dispatch"], getState: () => FilterGalleryState) => {
    const portal = new Portal();
    portal.authMode = "anonymous";
    portal.load().then(() => {
        portal["baseUrl"] = getOrgBaseUrl(portal);
        dispatch({ type: SIGNED_OUT, payload: portal });
        dispatch(search(true));
    });
};
