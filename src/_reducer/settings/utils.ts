import * as request from "esri/request";

import { getOrgBaseUrl } from "../../_utils";
import { Pojo, Action } from "../../Component";

export interface UtilsState {
    iconDir: string;
    portal: Pojo;
    request: __esri.request;
}

export const initialState: UtilsState = {
    iconDir: window["require"].toUrl("esri/images/portal"),
    portal: {},
    request: request as any as __esri.request
};

export default (state: UtilsState = initialState, action: Action) => {
    switch (action.type) {
        default:
            if (!!state.portal.portalHostname && !state.portal.baseUrl) {
                state.portal.baseUrl = getOrgBaseUrl(state.portal);
            }
            return state;
    }
};
