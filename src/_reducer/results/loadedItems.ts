import { LOADING_CONTENT_SUCCESS, CHANGE_PAGE_SUCCESS } from "../../_actions";
import { Pojo, Action } from "../../Component";

export type LoadedItemsState = {
    [id: string]: Pojo;
};
export const initialState: LoadedItemsState = {};

export default (state: LoadedItemsState = initialState, action: Action): LoadedItemsState => {
    switch (action.type) {
        case LOADING_CONTENT_SUCCESS:
            return action.payload.search.results.reduce(
                (acc: LoadedItemsState, c: Pojo) => {
                    acc[c.id] = c;
                    return acc;
                },
                state
            );
        case CHANGE_PAGE_SUCCESS:
            return action.payload.displayItems.reduce(
                (acc: LoadedItemsState, c: Pojo) => {
                    acc[c.id] = c;
                    return acc;
                },
                state
            );
        default:
            return state;
    }
};
