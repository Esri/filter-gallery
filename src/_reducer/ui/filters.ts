import {
    CLEAR_ALL_FILTERS,
    TOGGLE_FILTERS,
    UPDATE_CREATED_FILTER,
    UPDATE_MODIFIED_FILTER
} from "../../_actions";
import { DateRangeSection } from "../../components/DateSelection/DateRangeSelector/index";
import { Action } from "../../Component";

export interface FiltersState {
    createdSection?: DateRangeSection;
    modifiedSection?: DateRangeSection;
    filtersOpen: boolean;
}
export const initialState: FiltersState = {
    filtersOpen: false
};

export default (state: FiltersState = initialState, action: Action) => {
    switch (action.type) {
        case CLEAR_ALL_FILTERS:
            return {
                filtersOpen: state.filtersOpen
            };
        case UPDATE_MODIFIED_FILTER:
            return {
                ...state,
                modifiedSection: action.payload.section
            };
        case UPDATE_CREATED_FILTER:
            return {
                ...state,
                createdSection: action.payload.section
            };
        case TOGGLE_FILTERS:
            return {
                ...state,
                filtersOpen: !state.filtersOpen
            };
        default:
            return state;
    }
};
