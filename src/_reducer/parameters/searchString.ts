import { CHANGE_SEARCH_STRING, LOADING_CONTENT } from "../../_actions";
import { Action } from "../../Component";

export interface SearchStringState {
    current: string;
    previous: string;
}
export const initialState = {
    current: "",
    previous: ""
};

export default (
    state: SearchStringState = initialState,
    action: Action
): SearchStringState => {
    switch (action.type) {
        case LOADING_CONTENT:
            return {
                ...state,
                previous: state.current
            };
        case CHANGE_SEARCH_STRING:
            return {
                ...state,
                current: action.payload
            };
        default:
            return state;
    }
};
