import { CHANGING_PAGE, CHANGE_PAGE_SUCCESS, CHANGE_PAGE_FAIL } from "../../_actions";
import { LOADING_CONTENT_SUCCESS } from "../../_actions";
import { Action, Pojo } from "../../Component";

export interface PaginationState {
    page: number;
    displayItems: Pojo[];
    status: string;
}

export const initialState: PaginationState = {
    page: 1,
    displayItems: [],
    status: "loading"
};

export default (state: PaginationState = initialState, action: Action) => {
    switch (action.type) {
        case CHANGING_PAGE:
            return {
                ...state,
                status: "loading"
            };
        case CHANGE_PAGE_SUCCESS:
            return {
                ...state,
                displayItems: action.payload.displayItems,
                page: action.payload.page,
                status: "success"
            };
        case CHANGE_PAGE_FAIL:
            return {
                ...state,
                status: "failed"
            };
        case LOADING_CONTENT_SUCCESS:
            return {
                ...state,
                displayItems: action.payload.search.results,
                status: "success",
                page: 1
            };
        default:
            return state;
    }
};
