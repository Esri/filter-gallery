import { combineReducers } from "../../Component";

import filter, { FilterState, initialState as filterInitial } from "./filter";
import nextQuery, { NextQueryState, initialState as nextQueryInitial } from "./nextQuery";
import sort, { SortState, initialState as sortInitial } from "./sort";
import searchString, { SearchStringState, initialState as searchStringInitial } from "./searchString";

export interface ParametersState {
    filter: FilterState;
    nextQuery: NextQueryState;
    searchString: SearchStringState;
    sort: SortState;
}

export const initialState = {
    filter: filterInitial,
    nextQuery: nextQueryInitial,
    searchString: searchStringInitial,
    sort: sortInitial
};

export default combineReducers<ParametersState>({
    filter,
    nextQuery,
    searchString,
    sort
});
