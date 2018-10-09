import { curry } from "../../functional/index";
import { Pojo } from "../../../Component";

/**
 * Returns the URI for an item's thumbnail based on the associated portal and the item data
 * @param portal - 4x or shimmed portal that the item is associated with
 * @param item - the item to determine the thumbnail URI for
 */
export const getItemThumbnail = (portal: Pojo, item: Pojo) => {
    let thumbURI = `${portal.baseUrl}/home/js/arcgisonline/css/images/default_thumb.png`;
    if (item.thumbnail) {
        thumbURI = `${portal.restUrl}/content/items/${item.id}/info/${item.thumbnail}${
            portal.credential ?
                `?token=${portal.credential.token}` :
                ""
        }`;
    }
    return thumbURI;
};

/**
 * (Curried, arity 2) Returns new item JSON containing the thumbURI for the item
 * 1. 4x or shimmed portal that the item is associated with
 * 2. the item JSON to mix thumbURI into
 */
export const mixinItemThumbnail = curry((portal: Pojo, item: Pojo) => ({
    ...item,
    thumbURI: getItemThumbnail(portal, item)
}));
