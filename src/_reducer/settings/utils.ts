import request = require("esri/request");

import { getOrgBaseUrl } from "../../_utils";
import { Pojo, Action } from "../../Component";
import { SIGNED_IN, SIGNED_OUT, LOAD_PORTAL_SUCCESS, LOAD_PORTAL_FAILED, 
    AUTHENTICATION_FAILED, ORIGIN_FAILED } from "../../_actions";

export interface UtilsState {
    base: Pojo;
    iconDir: string;
    portal: Pojo;
    portalStatus: "loading" | "success" | "failed" | "noauth" | "originother" | "ie11";
    request: (url: string, options?: Pojo) => dojo.Deferred<any>;
}

export const initialState: UtilsState = {
    base: {},
    iconDir: window["require"].toUrl("esri/images/portal"),
    portal: {},
    portalStatus: "loading",
    request: request as any as (url: string, options?: Pojo) => dojo.Deferred<any>
};

export default (state: UtilsState = initialState, action: Action) => {
    switch (action.type) {
        case SIGNED_IN:
            action.payload["baseUrl"] = getOrgBaseUrl(action.payload);
            return {
                ...state,
                portal: action.payload
            };
        case SIGNED_OUT:
            action.payload["baseUrl"] = getOrgBaseUrl(action.payload);
            return {
                ...state,
                portal: action.payload
            };
        case LOAD_PORTAL_SUCCESS:
            action.payload.portal["baseUrl"] = getOrgBaseUrl(action.payload.portal);
            return {
                ...state,
                portal: action.payload.portal,
                portalStatus: "loaded" as UtilsState["portalStatus"]
            };
        case LOAD_PORTAL_FAILED:
            return {
                ...state,
                portalStatus: "failed" as UtilsState["portalStatus"]
            };
        case AUTHENTICATION_FAILED:
            return {
                ...state,
                portalStatus: "noauth" as UtilsState["portalStatus"]
            };
        case ORIGIN_FAILED:
            return {
                ...state,
                portalStatus: "originother" as UtilsState["portalStatus"],
                err: action.payload
            };
        default:
            return state;
    }
};
