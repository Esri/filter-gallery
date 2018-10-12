import { Action } from "../../Component";

export const TOGGLE_FILTERS = "TOGGLE_FILTERS";
export const TOGGLE_SORT = "TOGGLE_SORT";

export const toggleExpandedFilters = (): Action => ({
    type: TOGGLE_FILTERS
});

export const toggleExpandedSort = (): Action => ({
    type: TOGGLE_SORT
});
