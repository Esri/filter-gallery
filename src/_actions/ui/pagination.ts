export const CHANGE_PAGE_SUCCESS = "CHANGE_PAGE_SUCCESS";
export const CHANGE_PAGE_FAIL = "CHANGE_PAGE_FAIL";
export const CHANGING_PAGE = "CHANGING_PAGE";

export const changePage = (page: number) => ({ type: CHANGING_PAGE, payload: page });
