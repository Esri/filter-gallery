export const SEARCH = "SEARCH";
export const LOADING_CONTENT = "LOADING_CONTENT";
export const LOADING_CONTENT_SUCCESS = "LOADING_CONTENT_SUCCESS";
export const LOADING_CONTENT_FAILED = "LOADING_CONTENT_FAILED";

/**
 * Action creator for starting a new search based on the current state
 * @param updateCounts - indicates whether or not to also fetch count aggregations alongside this query
 */
export const search = (updateCounts?: boolean) => ({ type: SEARCH, payload: updateCounts });
