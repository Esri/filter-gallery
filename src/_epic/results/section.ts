import { withLatestFrom, switchMap, map, catchError } from "rxjs/operators";
import { LOADING_SECTION_INFO, UPDATE_SECTION_INFO_SUCCESS, UPDATE_SECTION_INFO_FAILED, SIGNED_IN } from "../../_actions";
import { Subject, Observable, of } from "rxjs";
import { Action, ofType, combineEpics } from "../../Component";
import { FilterGalleryState } from "../../_reducer";

import * as all from "dojo/promise/all";
import { fetchGroupById, fetchGroupCategorySchema, fromDeferred, fetchOrgCategorySchema } from "../../_utils";

export default (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    ofType(LOADING_SECTION_INFO),
    withLatestFrom(state$),
    switchMap(([, state ]) => {
        const { request, portal } = state.settings.utils;
        const id = state.settings.config.section.id;

        const requests = all([
            fetchGroupById(request, portal, id),
            state.settings.config.useOrgCategories && !!state.settings.utils.portal.id ?
                fetchOrgCategorySchema(request, portal) :
                fetchGroupCategorySchema(request, portal, id)
        ]);

        return fromDeferred(requests as any).pipe(
            map((responses) => ({
                type: UPDATE_SECTION_INFO_SUCCESS,
                payload: { group: responses[0], schema: responses[1].categorySchema } 
            })),
            catchError((err) => of({ type: UPDATE_SECTION_INFO_FAILED }))
        );
    })
);
