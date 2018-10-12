import { UPDATE_FULL_ITEM_DETAILS, FETCH_FULL_ITEM_DETAILS_FAILED, VIEW_ITEM_DETAILS } from "../../_actions";
import { Action } from "../../Component";

export interface FailedItemDetailsState {
    [itemId: string]: boolean;
}
export const initialState: FailedItemDetailsState = {};

export default (state: FailedItemDetailsState = initialState, action: Action) => {
    switch (action.type) {
        case UPDATE_FULL_ITEM_DETAILS:
            if (state[action.payload.item.id]) {
                const newState = { ...state };
                delete newState[action.payload.item.id];
                return newState;
            }
            return state;
        case VIEW_ITEM_DETAILS:
            if (state[action.payload.id]) {
                const newState = { ...state };
                delete newState[action.payload.id];
                return newState;
            }
            return state;
        case FETCH_FULL_ITEM_DETAILS_FAILED:
            return {
                ...state,
                [action.payload]: true
            };
        default:
            return state;
    }
};
