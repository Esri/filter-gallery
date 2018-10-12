import { curry } from "../../functional";

/**
 * (Curried, arity 2) Returns new q including the access query based on a tags filter
 * @param tags current value of a tags filter
 * @param q previous q
 */
export const appendTagsQ = curry((tags: { [tagName: string]: boolean } | undefined, q: string[]) => {
    if (tags) {
        const tagsArr = Object.keys(tags);
        if (tagsArr.length > 0) {
            return [ ...q, `tags:(${tagsArr.join(" AND ")})` ];
        }
    }
    return q;
});

/**
 * Returns new q based on supplied tag
 * @param tag string representing the tag
 * @param q previous q
 */
export const appendTagQ = curry((tag: string, q: string[]) => {
    if (tag.length > 2) {
        return [ ...q, `tags:(${tag}* OR ${tag})` ];
    }
    return q;
});
