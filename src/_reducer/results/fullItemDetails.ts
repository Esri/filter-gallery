import { UPDATE_FULL_ITEM_DETAILS, FETCH_FULL_ITEM_DETAILS_FAILED } from "../../_actions";
import { Pojo, Action } from "../../Component";

export interface FullItemDetailsState {
    [itemId: string]: Pojo;
}
export const initialState: FullItemDetailsState = {};

export default (state: FullItemDetailsState = initialState, action: Action) => {
    switch (action.type) {
        case UPDATE_FULL_ITEM_DETAILS:
            return {
                ...state,
                [action.payload.item.id]: action.payload.item
            };
        case FETCH_FULL_ITEM_DETAILS_FAILED:
            if (state[action.payload]) {
                const newState = { ...state };
                delete newState[action.payload];
                return newState;
            }
            return state;
        default:
            return state;
    }
};
