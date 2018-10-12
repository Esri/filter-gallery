import {
    CLEAR_ALL_FILTERS,
    UPDATE_CATEGORIES_FILTER,
    UPDATE_ITEM_TYPE_FILTER,
    UPDATE_MODIFIED_FILTER,
    UPDATE_CREATED_FILTER,
    UPDATE_SHARED_FILTER,
    UPDATE_STATUS_FILTER,
    UPDATE_TAGS_FILTER
} from "../../_actions";

import { CategoriesOption } from "../../components/Filters/CategoriesFilter";
import { ItemTypeOption } from "../../components/Filters/ItemTypeFilter/index";
import { SharedOption } from "../../components/Filters/SharedFilter";
import { StatusOption } from "../../components/Filters/StatusFilter";
import { Action } from "../../Component";

export interface FilterState {
    categories?: CategoriesOption;
    itemType?: ItemTypeOption;
    dateModified?: {
        start: number;
        end: number;
        label: string;
    };
    dateCreated?: {
        start: number;
        end: number;
        label: string;
    };
    shared?: SharedOption;
    status?: StatusOption;
    tags?: { [tagName: string]: boolean };
}
export const initialState = {};

export default (state: FilterState = initialState, action: Action): FilterState => {
    switch (action.type) {
        case CLEAR_ALL_FILTERS:
            return {};
        case UPDATE_CATEGORIES_FILTER:
            return {
                ...state,
                categories: action.payload
            };
        case UPDATE_ITEM_TYPE_FILTER:
            return {
                ...state,
                itemType: action.payload
            };
        case UPDATE_MODIFIED_FILTER:
            return {
                ...state,
                dateModified: action.payload.modified
            };
        case UPDATE_CREATED_FILTER:
            return {
                ...state,
                dateCreated: action.payload.created
            };
        case UPDATE_SHARED_FILTER:
            return {
                ...state,
                shared: action.payload
            };
        case UPDATE_STATUS_FILTER:
            return {
                ...state,
                status: action.payload
            };
        case UPDATE_TAGS_FILTER:
            return {
                ...state,
                tags: action.payload
            };
        default:
            return state;
    }
};
