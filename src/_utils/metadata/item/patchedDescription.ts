import { curry } from "../../functional";
import { Pojo } from "../../../Component";

/**
 * Returns the patched description for an item based on the jsapi location relative to the current portal
 * @param portal - 4x or shimmed portal that the item is associated with
 * @param item - the item to get the patched description for
 */
export const getPatchedItemDescription = (portal: Pojo, item: Pojo) => {
    return item.description ?
        item.description.replace(
            /src=('|")js\/jsapi\/esri\//g,
            (match: string) => `src=${match[4] === `"` ? `"` : `'`}${portal.baseUrl}/home/js/jsapi/esri/`
        ) : undefined;
};

/**
 * (Curried, arity 2) Returns new item JSON containing the patched description
 * 1. 4x or shimmed portal that the item is associated with
 * 2. the item JSON to patch
 */
export const mixinPatchedItemDescription = curry((portal: Pojo, item: Pojo) => ({
    ...item,
    patchedDescription: getPatchedItemDescription(portal, item)
}));
