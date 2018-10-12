import { FilterGalleryState } from "../../_reducer";

export const CHANGE_SORT_ORDER = "CHANGE_SORT_ORDER";
export const CHANGE_SORT_FIELD = "CHANGE_SORT_FIELD";

export const changeSortOrder = (newOrder: FilterGalleryState["parameters"]["sort"]["order"]) => ({
    type: CHANGE_SORT_ORDER,
    payload: newOrder
});

export const changeSortField = (newField: FilterGalleryState["parameters"]["sort"]["field"]) => ({
    type: CHANGE_SORT_FIELD,
    payload: newField
});