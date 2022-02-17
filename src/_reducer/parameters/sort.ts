import { CHANGE_SORT_ORDER, CHANGE_SORT_FIELD, UPDATE_SECTION_INFO_SUCCESS, LOAD_PORTAL_SUCCESS } from "../../_actions";
import { Action } from "../../Component";
import ActionBase from "esri/support/actions/ActionBase";

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
        case LOAD_PORTAL_SUCCESS:
            const defaultField = action.payload.config.sortDefault;
            return {
                ...state,
                field: defaultField,
                order: defaultSortDirection[defaultField] ? defaultSortDirection[defaultField] : state.order
            };
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
        case UPDATE_SECTION_INFO_SUCCESS:
            return {
                ...state,
                field: action.payload?.sortField || state.field,
                order: action.payload?.sortOrder || state.order
            };
        default:
            return state;
    }
};
