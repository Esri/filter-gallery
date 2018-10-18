import {
    LOADING_CONTENT_SUCCESS,
    LOADING_SECTION_INFO,
    UPDATE_SECTION_INFO_FAILED,
    UPDATE_SECTION_INFO_SUCCESS
} from "../../_actions";

import { clearCountsRecursive, formatRecursive, mapCountsToSchema } from "./_utils/categories";
import { ToggleOption } from "../../components/Buttons/Toggle";
import { Action, Pojo } from "../../Component";

export interface SectionState {
    group: Pojo;
    status: "initial" | "loading" | "loaded" | "failed";
    schema?: ToggleOption;
    sort?: {
        field: string;
        order: string;
    };
}

export const initialState: SectionState = {
    group: {},
    status: "initial"
};

export default (state: SectionState = initialState, action: Action) => {
    switch (action.type) {
        case LOADING_SECTION_INFO:
            return {
                ...state,
                status: "loading" as SectionState["status"]
            };
        case UPDATE_SECTION_INFO_SUCCESS:
            return {
                ...state,
                group: action.payload.group,
                schema: {
                    displayName: state.group.title,
                    value: state.group.id,
                    children: formatRecursive(action.payload.schema)
                },
                sort: {
                    field: action.payload.group.sortField ? action.payload.group.sortField : "relevance",
                    order: action.payload.group.sortOrder ? action.payload.group.sortOrder : "desc"
                },
                status: "loaded" as SectionState["status"]
            };
        case UPDATE_SECTION_INFO_FAILED:
            return {
                ...state,
                status: "failed" as SectionState["status"]
            };
        case LOADING_CONTENT_SUCCESS:
            if (action.payload.aggregations && state.schema) {
                const fieldName = action.payload.aggregations.counts.reduce((acc: string, c: { fieldName: string }) => {
                    if (c.fieldName === "categories") {
                        return c.fieldName;
                    }
                    return acc;
                }, "groupCategories");
                return {
                    ...state,
                    schema: mapCountsToSchema(
                        action.payload.aggregations,
                        clearCountsRecursive(state.schema),
                        fieldName
                    )
                };
            }
            return state;
        default:
            return state;
    }
};
