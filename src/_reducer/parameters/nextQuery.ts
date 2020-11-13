import { LOADING_CONTENT, LOADING_CONTENT_SUCCESS } from "../../_actions";
import { Action } from "../../Component";

export interface NextQueryState {
    nextStart: number;
    total: number;
}
export const initialState: NextQueryState = {
    nextStart: -1,
    total: 0
};

export default (state: NextQueryState = initialState, action: Action): NextQueryState => {
    switch (action.type) {
        case LOADING_CONTENT:
            return {
                ...state,
                total: 0
            };
        case LOADING_CONTENT_SUCCESS:
            return {
                nextStart: action.payload.search.nextStart,
                total: action.payload.search.total
            };
        default:
            return state;
    }
};
