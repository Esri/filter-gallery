import { combineReducers } from "../../Component";

import resultPanel, { ResultPanelState, initialState as resultPanelInitial } from "./resultPanel";
import filters, { FiltersState, initialState as filtersInitial } from "./filters";
import tagsFilter, { TagsFilterState, initialState as tagsFilterInitial } from "./tagsFilter";
import pagination, { PaginationState, initialState as paginationInitialState } from "./pagination";

export interface UIState {
    resultPanel: ResultPanelState;
    filters: FiltersState;
    tagsFilter: TagsFilterState;
    pagination: PaginationState;
}
export const initialState: UIState = {
    resultPanel: resultPanelInitial,
    filters: filtersInitial,
    tagsFilter: tagsFilterInitial,
    pagination: paginationInitialState
};

export default combineReducers<UIState>({
    resultPanel,
    filters,
    tagsFilter,
    pagination
});
