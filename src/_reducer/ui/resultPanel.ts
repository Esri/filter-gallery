import {
    LOADING_CONTENT,
    LOADING_CONTENT_FAILED,
    LOADING_CONTENT_SUCCESS,
    CHANGE_RESULT_DISPLAY,
    SHOW_EMPTY_RESULTS
} from "../../_actions";
import { Action } from "../../Component";

export interface ResultPanelState {
    display: "list" | "table";
    status: "loading" | "loadingNext" | "failed" | "success" | "empty";
}
export const initialState: ResultPanelState = {
    display: "list",
    status: "empty"
};

export default (state: ResultPanelState = initialState, action: Action): ResultPanelState => {
    switch (action.type) {
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
                display: state.display === "table" ? "list" : "table"
            };
        case SHOW_EMPTY_RESULTS:
            return {
                ...state,
                status: "empty"
            };
        default:
            return state;
    }
};
