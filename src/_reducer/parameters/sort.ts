import { CHANGE_SORT_ORDER, CHANGE_SORT_FIELD, UPDATE_SECTION_INFO } from "../../_actions";
import { Action } from "../../Component";

export interface SortState {
    field: "relevance" | "title" | "created" | "type" | "owner" | "modified" | "avgrating" | "numcomments" | "numviews";
    order: "asc" | "desc";
}
export const initialState: SortState = {
    field: "relevance",
    order: "desc"
};

export const defaultSortField = {
    myContent: "modified",
    myFavorites: "relevance",
    myGroups: "relevance",
    myOrganization: "relevance",
    livingAtlas: "relevance",
    all: "relevance"
};

export const defaultSortDirection = {
    relevance: "desc",
    title: "asc",
    created: "desc",
    owner: "asc",
    modified: "desc",
    numviews: "desc",
    avgrating: "desc"
};

export default (state: SortState = initialState, action: Action): SortState => {
    switch (action.type) {
        case CHANGE_SORT_ORDER:
            return {
                ...state,
                order: action.payload
            };
        case CHANGE_SORT_FIELD:
            const field = action.payload;
            return {
                field,
                order: defaultSortDirection[field] ? defaultSortDirection[field] : state.order
            };
        case UPDATE_SECTION_INFO:
            return {
                field: action.payload.sortField ? action.payload.sortField : "relevance",
                order: action.payload.sortOrder ? action.payload.sortOrder : "desc"
            };
        default:
            return state;
    }
};
