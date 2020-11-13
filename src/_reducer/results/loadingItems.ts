import {
    ADD_TO_FAVORITES,
    ADD_TO_FAVORITES_SUCCESS,
    ADD_TO_FAVORITES_FAIL,
    REMOVE_FROM_FAVORITES,
    REMOVE_FROM_FAVORITES_SUCCESS,
    REMOVE_FROM_FAVORITES_FAIL
} from "../../_actions";
import { Pojo, Action } from "../../Component";

export interface LoadingItemsState {
    [itemId: string]: Pojo;
}
export const initialState: LoadingItemsState = {};

export default (state: LoadingItemsState = {}, action: Action) => {
    switch (action.type) {
        case ADD_TO_FAVORITES:
            return {
                ...state,
                [action.payload.id]: action.payload
            };
        case ADD_TO_FAVORITES_SUCCESS:
            return {
                ...state,
                [action.payload.id]: undefined
            };
        case ADD_TO_FAVORITES_FAIL:
            return {
                ...state,
                [action.payload.id]: undefined
            };
        case REMOVE_FROM_FAVORITES:
            return {
                ...state,
                [action.payload.id]: action.payload
            };
        case REMOVE_FROM_FAVORITES_SUCCESS:
            return {
                ...state,
                [action.payload.id]: undefined
            };
        case REMOVE_FROM_FAVORITES_FAIL:
            return {
                ...state,
                [action.payload.id]: undefined
            };
        default:
            return state;
    }
};
