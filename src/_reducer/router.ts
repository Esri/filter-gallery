import { Action } from "../Component";
import { HASH_CHANGE } from "../_actions";

export interface RouterState {
    hash: {
        [param: string]: string;
    };
}

export const initialState: RouterState = {
    hash: {}
};

export default (state: RouterState = initialState, action: Action): RouterState => {
    switch (action.type) {
        case HASH_CHANGE:
            return action.payload;
        default:
            return state;
    }
};
