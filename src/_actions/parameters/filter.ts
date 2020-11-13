import { FilterGalleryState } from "../../_reducer";

export const UPDATE_CUSTOM_FILTER = "UPDATE_CUSTOM_FILTER";
export const UPDATE_ORG_GROUP_FILTER = "UPDATE_ORG_GROUP_FILTER";
export const UPDATE_LIVING_ATLAS_CATEGORIES_FILTER = "UPDATE_LIVING_ATLAS_CATEGORIES_FILTER";
export const UPDATE_LIVING_ATLAS_REGION_FILTER = "UPDATE_LIVING_ATLAS_REGION_FILTER";
export const UPDATE_ORG_CATEGORIES_FILTER = "UPDATE_ORG_CATEGORIES_FILTER";
export const UPDATE_CATEGORIES_FILTER = "UPDATE_GROUP_CATEGORIES_FILTER";
export const UPDATE_ITEM_TYPE_FILTER = "UPDATE_ITEM_TYPE_FILTER";
export const UPDATE_MODIFIED_FILTER = "UPDATE_MODIFIED_FILTER";
export const UPDATE_CREATED_FILTER = "UPDATE_CREATED_FILTER";
export const UPDATE_SHARED_FILTER = "UPDATE_SHARED_FILTER";
export const UPDATE_GROUP_FILTER = "UPDATE_GROUP_FILTER";
export const UPDATE_FOLDER_FILTER = "UPDATE_FOLDER_FILTER";
export const UPDATE_STATUS_FILTER = "UPDATE_STATUS_FILTER";
export const UPDATE_MAP_AREA_FILTER = "UPDATE_MAP_AREA_FILTER";
export const UPDATE_SEARCH_ORG_FILTER = "UPDATE_SEARCH_ORG_FILTER";
export const UPDATE_TAGS_FILTER = "UPDATE_TAGS_FILTER";
export const CLEAR_ALL_FILTERS = "CLEAR_ALL_FILTERS";

export const updateItemTypeFilter = (itemType?: FilterGalleryState["parameters"]["filter"]["itemType"]) => {
    return {
        type: UPDATE_ITEM_TYPE_FILTER,
        payload: itemType
    };
};

export const updateCategoriesFilter = (
    categories?: FilterGalleryState["parameters"]["filter"]["categories"]
) => {
    return {
        type: UPDATE_CATEGORIES_FILTER,
        payload: categories
    };
};

export const updateModifiedFilter = (
        section?: FilterGalleryState["ui"]["filters"]["modifiedSection"],
        modified?: FilterGalleryState["parameters"]["filter"]["dateModified"]
) => {
    return {
        type: UPDATE_MODIFIED_FILTER,
        payload: { section, modified }
    };
};

export const updateCreatedFilter = (
    section?: FilterGalleryState["ui"]["filters"]["createdSection"],
    created?: FilterGalleryState["parameters"]["filter"]["dateModified"]
) => {
    return {
        type: UPDATE_CREATED_FILTER,
        payload: { section, created }
    };
};

export const updateSharedFilter = (shared?: FilterGalleryState["parameters"]["filter"]["shared"]) => {
    return {
        type: UPDATE_SHARED_FILTER,
        payload: shared
    };
};

export const updateStatusFilter = (status?: FilterGalleryState["parameters"]["filter"]["status"]) => {
    return {
        type: UPDATE_STATUS_FILTER,
        payload: status
    };
};

export const updateTagsFilter = (tags?: { [tagName: string]: boolean }) => {
    return {
        type: UPDATE_TAGS_FILTER,
        payload: tags
    };
};
