import * as debounce from "dojo/debounce";
import { FilterGalleryState } from "../../_reducer";
import { getTagsRequest } from "./_utils/requestHelpers";
export const LOADING_TAGS = "LOADING_TAGS";
export const LOADING_TAGS_SUCCESS = "LOADING_TAGS_SUCCESS";
export const LOADING_TAGS_FAILED = "LOADING_TAGS_FAILED";
export const UPDATE_TAGS_FILTER_STRING = "UPDATE_TAGS_FILTER_STRING";

export const updateTagsFilterString = (tagName: string) => (dispatch: any, getState: () => FilterGalleryState) => {
    dispatch({
        type: UPDATE_TAGS_FILTER_STRING,
        payload: tagName
    });

    if (tagName.length > 2) {
        loadTags(dispatch, getState(), tagName);
    }
};

export const loadTags = debounce((dispatch: any, state: FilterGalleryState, tagName: string) => {
    dispatch({ type: LOADING_TAGS });

    const request = state.settings.utils.request;
    const [ tagsUrl, tagsParameters ] = getTagsRequest(state, tagName);

    request(tagsUrl, tagsParameters)
        .then(
            (response: any) => { dispatch({ type: LOADING_TAGS_SUCCESS, payload: response.data })},
            (err: any) => dispatch({ type: LOADING_TAGS_FAILED, payload: err })
        );
}, 400);
