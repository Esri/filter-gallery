import { combineReducers } from "../../Component";

import allOrganizations, { AllOrganizationsState, initialState as allOrganizationsInitial } from "./allOrganizations";
import counts, { CountsState, initialState as countsInitial } from "./counts/index";
import displayItems, { DisplayItemsState, initialState as displayItemsInitial } from "./displayItems";
import loadingItems, { LoadingItemsState, initialState as loadingItemsInitial } from "./loadingItems";
import section, { SectionState, initialState as sectionInitial } from "./section";
import user, { UserState, initialState as userInitial } from "./user";

export interface ResultsState {
    allOrganizations: AllOrganizationsState;
    counts: CountsState;
    displayItems: DisplayItemsState;
    loadingItems: LoadingItemsState;
    section: SectionState;
    user: UserState;
}
export const initialState = {
    allOrganizations: allOrganizationsInitial,
    counts: countsInitial,
    displayItems: displayItemsInitial,
    loadingItems: loadingItemsInitial,
    section: sectionInitial,
    user: userInitial
};

export default combineReducers<ResultsState>({
    allOrganizations,
    counts,
    displayItems,
    loadingItems,
    section,
    user
});
