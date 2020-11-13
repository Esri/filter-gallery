export const CHANGE_SEARCH_STRING = "CHANGE_SEARCH_STRING";

export const changeSearchString = (searchString: string) => ({
    type: CHANGE_SEARCH_STRING,
    payload: searchString
});
