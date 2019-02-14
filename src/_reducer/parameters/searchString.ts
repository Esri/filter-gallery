import { CHANGE_SEARCH_STRING, LOADING_CONTENT, HASH_CHANGE } from "../../_actions";
import { Action } from "../../Component";
import { Pojo } from "../../Component";

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
            const hashParams = parseParms(action.payload);
            console.log(hashParams)
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

function parseParms(str:string):Pojo {
    var separators = ['&', '?'], pieces = str.split(new RegExp('[' + separators.join('') + "]")), data = {}, i, parts;
    for (i = 0; i < pieces.length; i++) {
        parts = pieces[i].split("=");
        if (parts.length < 2) {
            parts.push("");
        }
        data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    }
    return data;
}