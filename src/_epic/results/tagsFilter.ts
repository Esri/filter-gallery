import { Subject, Observable, of } from "rxjs";
import { Action, combineEpics, ofType } from "../../Component";
import { FilterGalleryState } from "../../_reducer";
import { debounceTime, mapTo, map, catchError, mergeMap } from "rxjs/operators";
import { UPDATE_TAGS_FILTER_STRING, LOADING_TAGS, LOADING_TAGS_SUCCESS, LOADING_TAGS_FAILED } from "../../_actions";
import { getTagsRequest } from "../../_actions/results/_utils/requestHelpers";
import { fromDeferred } from "../../_utils";

export const filterStringEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(UPDATE_TAGS_FILTER_STRING),
    debounceTime(400),
    mapTo({ type: LOADING_TAGS })
);

export const loadingTagsEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOADING_TAGS),
    mergeMap(() => {
        const state = getState();
        const request = state.settings.utils.request;
        const [ tagsUrl, tagsParameters ] = getTagsRequest(state, state.ui.tagsFilter.filterString);

        return fromDeferred(request(tagsUrl, tagsParameters)).pipe(
            map(response => ({ type: LOADING_TAGS_SUCCESS, payload: response.data })),
            catchError(err => of({
                type: LOADING_TAGS_FAILED,
                payload: err
            }))
        );
    })
);

export default combineEpics(
    filterStringEpic,
    loadingTagsEpic
);
