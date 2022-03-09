import { switchMap, map, catchError } from "rxjs/operators";
import { LOADING_SECTION_INFO, UPDATE_SECTION_INFO_SUCCESS, UPDATE_SECTION_INFO_FAILED, SIGNED_IN, LOAD_PORTAL_SUCCESS } from "../../_actions";
import { Subject, of } from "rxjs";
import { Action, ofType, combineEpics } from "../../Component";
import { FilterGalleryState } from "../../_reducer";

import all = require("dojo/promise/all");
import { fetchGroupById, fetchGroupCategorySchema, fromDeferred, fetchOrgCategorySchema, fetchSelf, fetchAllLivingAtlasInfo } from "../../_utils";
import Deferred = require("dojo/_base/Deferred");

export const baseEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOADING_SECTION_INFO),
    switchMap(() => {
        const state = getState();
        const { request, portal } = state.settings.utils;
        const id = state.settings.config.section.id;
        const requests = all([
            fetchGroupById(request, portal, id),
            state.settings.config.useOrgCategories && !!state.settings.utils.portal.id ?
                fetchOrgCategorySchema(request, portal) :
                fetchGroupCategorySchema(request, portal, id),
            fetchSelf(request, portal).then(self => fetchAllLivingAtlasInfo(request, portal, self, "en"))
        ]);

        return fromDeferred(requests as any).pipe(
            map(((responses: any) => ({
                type: UPDATE_SECTION_INFO_SUCCESS,
                payload: { group: responses[0], schema: responses[1].categorySchema, livingAtlas: responses[2] } 
            })),
                catchError((err) => of({ type: UPDATE_SECTION_INFO_FAILED, payload: err }))
        ));
    })
);

export const updateSectionEpic = (action$: Subject<Action>, getState: () => FilterGalleryState) => action$.pipe(
    ofType(LOAD_PORTAL_SUCCESS),
    switchMap((action) => {
        const updateSection = action.payload?.updateSection || false;
        const deferred = new Deferred();
        deferred.resolve();
        if (updateSection) {
            return fromDeferred(deferred).pipe(
                    map(() => ({ type: LOADING_SECTION_INFO }))
                );
        }
        return fromDeferred(deferred).pipe(
            map(() => ({ type: "EMPTY_PROMISE" }))
        );
    })
);

export default combineEpics(
    baseEpic,
    updateSectionEpic
);
