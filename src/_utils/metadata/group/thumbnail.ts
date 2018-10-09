import { curry } from "../../functional/index";
import { Pojo } from "../../../Component";

/**
 * Returns the URI for a group's thumbnail (if available) based on the current portal and group data
 * @param portal - 4x or shimmed portal that the item is associated with
 * @param group - id of the group to determine the thumbnail URI for
 */
export const getGroupThumbnail = (portal: Pojo, group: Pojo): string | undefined => {
    let thumbURI;
    if (group.thumbnail) {
        thumbURI = `${portal.restUrl}/community/groups/${group.id}/info/${group.thumbnail}${
            portal.credential ?
                `?token=${portal.credential.token}` :
                ""
        }`;
    }
    return thumbURI;
};

/**
 * (Curried, arity 2) Returns new group JSON containing the thumbURI for the item
 * 1. 4x or shimmed portal that the item is associated with
 * 2. the group JSON to mix thumbURI into
 */
export const mixinGroupThumbnail = curry((portal: Pojo, group: Pojo) => ({
    ...group,
    thumbURI: getGroupThumbnail(portal, group)
}));