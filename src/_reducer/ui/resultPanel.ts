import {
    LOAD_PORTAL_SUCCESS,
    LOADING_CONTENT,
    LOADING_CONTENT_FAILED,
    LOADING_CONTENT_SUCCESS,
    CHANGE_RESULT_DISPLAY,
    SHOW_EMPTY_RESULTS,
    TOGGLE_VIEW_DROPDOWN
} from "../../_actions";
import { Action } from "../../Component";
import { ContentView } from "../../components/Dropdowns/ViewDropdown";
import { FilterGalleryStore } from "../..";

export interface ResultPanelState {
    display: ContentView;
    status: "loading" | "loadingNext" | "failed" | "success" | "empty";
    viewDropdownActive: boolean;
};
export const initialState: ResultPanelState = {
    display: "list",
    status: "empty",
    viewDropdownActive: false
};

export default (state: ResultPanelState = initialState, action: Action): ResultPanelState => {
    switch (action.type) {
        case LOAD_PORTAL_SUCCESS:
            return {
                ...state,
                display: action.payload.config.displayDefault
            };
        case LOADING_CONTENT_FAILED:
            return {
                ...state,
                status: "failed"
            };
        case LOADING_CONTENT_SUCCESS:
            return {
                ...state,
                status: "success"
            };
        case LOADING_CONTENT:
            return {
                ...state,
                status: "loading"
            };
        case CHANGE_RESULT_DISPLAY:
            return {
                ...state,
                display: action.payload,
                viewDropdownActive: false
            };
        case SHOW_EMPTY_RESULTS:
            return {
                ...state,
                status: "empty"
            };
        case TOGGLE_VIEW_DROPDOWN:
            return {
                ...state,
                viewDropdownActive: !state.viewDropdownActive
            };
        default:
            return state;
    }
};
