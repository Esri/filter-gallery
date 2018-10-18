import {
    appendAccessQ,
    appendDateModifiedQ,
    appendDateCreatedQ,
    appendItemTypeQ,
    appendStatusQ,
    appendTagQ,
    appendTagsQ,
    curry,
    compose,
    filterEmptyStrings,
    appendGroupQ,
} from "../../../_utils/index";
import { itemTypeMap } from "../../../_utils/index";
import { FilterGalleryState } from "../../../_reducer/index";

/**
 * Generates q for search query based on the current state of the item browser
 * @param state current state of the item browser
 */
export function getQ(state: FilterGalleryState) {
    return appendQs(state)([state.parameters.searchString.current]).join(" ");
}

/**
 * Generates q for counts query based on current state of the item browser
 * @param state current state of the item browser
 */
export function getCountsQ(state: FilterGalleryState) {
    return appendCountsQs(state)([state.parameters.searchString.current]).join(" ");
}

/**
 * Generates q for tags query based on tagName and current state of the item browser
 * @param state current state of the item browser
 */
export function getTagsQ(state: FilterGalleryState, tagName: string) {
    return appendTagsQs(state, tagName)([state.parameters.searchString.current]).join(" ");
}

/**
 * Appends search qs based on the state of the item browser
 * @param state current state of the item browser
 */
const appendQs = (state: FilterGalleryState) => compose(
    // Nested compose to preserve type safety across a big pipeline
    compose(
        filterEmptyStrings,
        appendStatusQ(state.parameters.filter.status, state.settings.utils.portal.user),
        appendSectionQ(state),
        appendGroupQ(orgValid(state))
    ),
    compose(
        appendAccessQ(state.parameters.filter.shared),
        appendDateCreatedQ(state.parameters.filter.dateCreated),
        appendDateModifiedQ(state.parameters.filter.dateModified),
        appendItemTypeQ(itemTypeMap, {
            allowedItemTypes: state.settings.config.allowedItemTypes,
            itemTypeFilter: state.parameters.filter.itemType
        }),
        appendTagsQ(state.parameters.filter.tags)
    )
);

/**
 * Appends counts qs based on the state of the item browser
 * @param state current state of the item browser
 */
const appendCountsQs = (state: FilterGalleryState) => compose(
    filterEmptyStrings,
    appendSectionQ(state),
    appendItemTypeQ(itemTypeMap, {
        allowedItemTypes: state.settings.config.allowedItemTypes
    }),
    appendGroupQ(orgValid(state))
);

/**
 * Appends Tags qs based on tag name and the current state of item browser
 * @param state current state of the item browser
 * @param tagName string for the tag to filter by 
 */
const appendTagsQs = (state: FilterGalleryState, tagName: string) => compose(
    filterEmptyStrings,
    appendSectionQ(state),
    appendItemTypeQ(itemTypeMap, {
        allowedItemTypes: state.settings.config.allowedItemTypes
    }),
    appendTagQ(tagName),
    appendGroupQ(orgValid(state))
);

/**
 * Returns new q including the section query based on the state of the item browser
 * @param state current state of the item browser
 * @param q previous q
 */
const appendSectionQ = curry((state: FilterGalleryState, q: string[]): string[] => {
    return [ ...q, state.settings.config.section.baseQuery];
});

function orgValid(state: FilterGalleryState) {
    return state.settings.config.useOrgCategories && !!state.settings.utils.portal.id ?
        { id: state.settings.config.section.id } :
        undefined;
}
