import { ItemTypeMap, ItemType, allItemTypes } from "../../metadata/item";
import { curry } from "../../functional";

export interface ItemTypeQOptions {
    allowedItemTypes: ItemType[];
    itemTypeFilter?: { value: string, [propName: string]: any };
    specialItemQ?: string;
}

/**
 * (Curried, arity 3) Returns portion of Q for item types based on the current state of the item browser
 * and a mapping of item display types to actual item types
 * 1. map of display types to actual item types
 * 2. configuration options for item types q
 * 3. existing q to append item type query to
 */
export const appendItemTypeQ = curry((
    map: ItemTypeMap,
    options: ItemTypeQOptions,
    q: string[]
): string[] => {
    const itemType = options.itemTypeFilter;
    const allowedItemTypes = options.allowedItemTypes;
    const specialItemQ = options.specialItemQ;
    if (!!itemType) {
        return [
            ...q,
            `${map[itemType.value]} AND (${getAllowedItemTypesQuery(allowedItemTypes)}${
                specialItemQ ?
                    ` OR (${specialItemQ})` :
                    ""
            })`
        ];
    } else if (specialItemQ) {
        return [ ...q, `(${getAllowedItemTypesQuery(allowedItemTypes)} OR (${specialItemQ}))` ];
    }
    return [ ...q, getAllowedItemTypesQuery(allowedItemTypes) ];
});

/**
 * Converts an array of allowed item types to a string compatible with the sharing API
 * @param allowedItemTypes array
 */
function getAllowedItemTypesQuery(allowedItemTypes: string[]): string {
    const partialMatches = allItemTypes
        .filter((type) => allowedItemTypes.indexOf(type) === -1)
        .filter((type) => allowedItemTypes.reduce(
            (result: boolean, current: ItemType) => {
                if (type.indexOf(current) > -1) {
                    return true;
                }
                return result;
            },
            false
        ));
    return `((type:"${allowedItemTypes.join("\" OR type:\"")}")${
        partialMatches.length > 0 ?
            ` AND (-type:"${partialMatches.join("\" AND -type:\"")}")` :
            ``
    })`;
}