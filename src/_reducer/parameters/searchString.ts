import { CHANGE_SEARCH_STRING, LOADING_CONTENT, HASH_CHANGE } from "../../_actions";
import { Action } from "../../Component";
import * as ioQuery from "dojo/io-query";

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
        case HASH_CHANGE:
            const hashParams = ioQuery.queryToObject(action.payload);
            return {
                ...state,
                current: (hashParams.query ? hashParams.query : "")
            }
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
