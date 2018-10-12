import { TOGGLE_SORT, CHANGE_SORT_FIELD, CHANGE_SORT_ORDER } from "../../_actions";
import { Action } from "../../Component";

export type SortState = boolean;
export const initialState: SortState = false;

export default (state: SortState, action: Action) => {
    switch (action.type) {
        case TOGGLE_SORT:
            return !state;
        case CHANGE_SORT_FIELD:
            return !state;
        case CHANGE_SORT_ORDER:
            return !state;
        default:
            return state;
    }
};
