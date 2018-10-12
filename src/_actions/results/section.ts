import * as all from "dojo/promise/all";
import * as Deferred from "dojo/Deferred";
import { FilterGalleryState } from "../../_reducer";
import { fetchGroupCategorySchema, fetchGroupById } from "../../_utils/index";

export const LOADING_SECTION_INFO = "LOADING_SECTION_INFO";
export const UPDATE_SECTION_INFO = "UPDATE_SECTION_INFO";
export const UPDATE_SECTION_INFO_FAILED = "UPDATE_SECTION_INFO_FAILED";

export const fetchSectionInfo = () => (dispatch: any, getState: () => FilterGalleryState) => {
    let state = getState();
    const { request, portal } = state.settings.utils;
    const id = state.settings.config.section.id;

    if (state.results.section.status === "loaded") {
        return (new Deferred).resolve();
    } else if (state.results.section.status === "failed") {
        return (new Deferred).reject();
    }

    dispatch({ type: LOADING_SECTION_INFO });

    const requests = all([
        fetchGroupById(request, portal, id),
        fetchGroupCategorySchema(request, portal, id)
    ]);

    return requests.then(
        (responses) => dispatch({
            type: UPDATE_SECTION_INFO,
            payload: { group: responses[0], schema: responses[1] }
        }),
        handleCustomSectionInfoError
    );

    function handleCustomSectionInfoError(err: Error) {
        console.error(err);
        dispatch({ type: UPDATE_SECTION_INFO_FAILED });
    }
};
