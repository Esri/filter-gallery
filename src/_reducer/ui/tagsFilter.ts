import { compose } from "../../_utils/index";
import { removeDupsOnKey } from "../../_utils/index";
import {
    LOADING_TAGS,
    LOADING_TAGS_SUCCESS,
    LOADING_TAGS_FAILED,
    LOADING_CONTENT_SUCCESS,
    UPDATE_TAGS_FILTER_STRING
} from "../../_actions";
import { Action } from "../../Component";

export interface Tag {
    value: string;
    count: number;
}

export interface TagsFilterState {
    allTags: Tag[];
    filterString: string;
    visibleTags: Tag[];
}

export const initialState = {
    allTags: [],
    filterString: "",
    visibleTags: []
};

export default (state: TagsFilterState = initialState, action: Action): TagsFilterState => {
    switch (action.type) {
        case UPDATE_TAGS_FILTER_STRING:
            return {
                ...state,
                filterString: action.payload,
                visibleTags: state.allTags.filter(
                    (tag: Tag) => action.payload.length === 0 || tag.value.indexOf(action.payload) > -1
                )
            };
        case LOADING_TAGS:
            return state;
        case LOADING_TAGS_SUCCESS:
            if (action.payload.aggregations) {
                const taggregations = (action.payload.aggregations.counts.filter((count: any) => (
                    count.fieldName === "tags"
                ))[0]);
                if (taggregations) {
                    const allTags = mixinNewTags(state.allTags, taggregations.fieldValues);
                    return {
                        ...state,
                        allTags,
                        visibleTags: allTags.filter(
                            (tag: Tag) => state.filterString.length === 0 || tag.value.indexOf(state.filterString) > -1
                        )
                    };
                }
            }
            return state;
        case LOADING_TAGS_FAILED:
            return state;
        case LOADING_CONTENT_SUCCESS:
            if (action.payload.aggregations) {
                const taggregations = (action.payload.aggregations.counts.filter((count: any) => (
                    count.fieldName === "tags"
                ))[0]);
                if (taggregations) {
                    const allTags = trimAndRemoveDups(taggregations.fieldValues);
                    return {
                        ...state,
                        allTags,
                        visibleTags: allTags.filter(
                            (tag: Tag) => state.filterString.length === 0 || tag.value.indexOf(state.filterString) > -1
                        )
                    };
                }
            }
            return state;
        default:
            return state;
    }
};

/**
 * Mix newly acquired tags into an existing array of tags
 * @param currentTags - array of existing tags
 * @param newTags - array of new tags
 */
function mixinNewTags(currentTags: Tag[], newTags: Tag[]): Tag[] {
    return trimAndRemoveDups(currentTags.concat(newTags));
}

/**
 * Removes duplicates from an array of tags based on their value
 */
const removeDuplicateTags = removeDupsOnKey("value");

/**
 * Removes whitespace from the value of tags
 * @param input - array of tags from which to remove whitespace
 */
const trimTags = (input: Tag[]) => input.map(({ value, count }: Tag) => ({ value: value.trim(), count }));

/**
 * Sorts tags based on their count in descending order
 * @param input - array of tags to sort in descending order
 */
const sortTagsDescending = (input: Tag[]) => input.sort((a: Tag, b: Tag) => b.count - a.count);

/**
 * Trims whitespace off tags and removes duplicates
 */
const trimAndRemoveDups = compose(
    removeDuplicateTags,
    trimTags,
    sortTagsDescending
);
