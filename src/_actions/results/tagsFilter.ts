export const LOADING_TAGS = "LOADING_TAGS";
export const LOADING_TAGS_SUCCESS = "LOADING_TAGS_SUCCESS";
export const LOADING_TAGS_FAILED = "LOADING_TAGS_FAILED";
export const UPDATE_TAGS_FILTER_STRING = "UPDATE_TAGS_FILTER_STRING";

export const updateTagsFilterString = (tagName: string) => ({ type: UPDATE_TAGS_FILTER_STRING, payload: tagName });
