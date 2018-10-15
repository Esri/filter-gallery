import * as request from "esri/request";

import { getOrgBaseUrl } from "../../_utils";
import { Pojo, Action } from "../../Component";
import { SIGNED_IN, SIGNED_OUT } from "../../_actions";

export interface UtilsState {
    iconDir: string;
    portal: Pojo;
    request: (url: string, options?: Pojo) => dojo.Deferred<any>;
}

export const initialState: UtilsState = {
    iconDir: window["require"].toUrl("esri/images/portal"),
    portal: {},
    request: request as any as (url: string, options?: Pojo) => dojo.Deferred<any>
};

export default (state: UtilsState = initialState, action: Action) => {
    switch (action.type) {
        case SIGNED_IN:
            return {
                ...state,
                portal: action.payload
            };
        case SIGNED_OUT:
            return {
                ...state,
                portal: action.payload
            };
        default:
            if (!!state.portal.portalHostname && !state.portal.baseUrl) {
                state.portal.baseUrl = getOrgBaseUrl(state.portal);
            }
            return state;
    }
};
