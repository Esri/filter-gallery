import {
    VIEW_ITEM_DETAILS,
    CLOSE_DETAILS_PANE,
    CLOSING_DETAILS_PANE
} from "../../_actions/index";
import { Action, Pojo } from "../../Component";

export interface DetailsPanelState {
    closing: boolean;
    open: boolean;
    item?: Pojo;
}
export const initialState: DetailsPanelState = {
    closing: false,
    open: false
};

export default (state: DetailsPanelState = initialState, action: Action): DetailsPanelState => {
    switch (action.type) {
        case CLOSING_DETAILS_PANE:
            return {
                ...state,
                closing: true
            };
        case CLOSE_DETAILS_PANE:
            return {
                ...state,
                closing: false,
                open: false,
                item: undefined
            };
        case VIEW_ITEM_DETAILS:
            return {
                ...state,
                open: true,
                item: action.payload
            };
        default:
            return state;
    }
};
