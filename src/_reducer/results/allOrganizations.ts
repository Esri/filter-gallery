import {
    CHANGE_PAGE_SUCCESS,
    LOADING_CONTENT_SUCCESS
} from "../../_actions";
import { Pojo, Action } from "../../Component";

export interface AllOrganizationsState {
    [propName: string]: Pojo;
}

export const initialState = {};

export default (state: AllOrganizationsState = initialState, action: Action) => {
    switch (action.type) {
        case LOADING_CONTENT_SUCCESS:
            return {
                ...state,
                ...action.payload.search.organizations
            };
        case CHANGE_PAGE_SUCCESS:
            return {
                ...state,
                ...action.payload.organizations
            };
        default:
            return state;
    }
};
