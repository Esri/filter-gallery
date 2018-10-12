import {
    ADD_TO_FAVORITES_SUCCESS,
    LOADING_USER_INFO,
    REMOVE_FROM_FAVORITES_SUCCESS,
    UPDATE_USER_INFO,
    UPDATE_USER_INFO_FAILED
} from "../../_actions";

import { Action } from "../../Component";

export interface UserState {
    favorites: {
        [itemId: string]: boolean;
    } | undefined;
    status: "initial" | "loading" | "loaded" | "failed";
}
export const initialState: UserState = {
    favorites: undefined,
    status: "initial"
};

export default (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
        case LOADING_USER_INFO:
            return {
                ...state,
                status: "loading"
            };
        case UPDATE_USER_INFO:
            return {
                ...state,
                favorites: action.payload.favorites,
                status: "loaded"
            };
        case UPDATE_USER_INFO_FAILED:
            return {
                ...state,
                status: "failed"
            };
        case ADD_TO_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: state.favorites ? 
                    { ...state.favorites, [action.payload.id]: true } :
                    { [action.payload.id]: true }
            };
        case REMOVE_FROM_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: state.favorites ?
                    { ...state.favorites, [action.payload.id]: false } :
                    {}
            };
        default:
            return state;
    }
};
