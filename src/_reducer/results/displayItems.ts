import { LOADING_CONTENT_SUCCESS } from "../../_actions";
import { Pojo, Action } from "../../Component";

export type DisplayItemsState = Pojo[];
export const initialState: DisplayItemsState = [];

export default (state: DisplayItemsState = [], action: Action): DisplayItemsState => {
    switch (action.type) {
        case LOADING_CONTENT_SUCCESS:
            return action.payload.search.results;
        default:
            return state;
    }
};
