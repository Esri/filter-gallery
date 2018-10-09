import { curry } from "../../functional/index";
import { Pojo } from "../../../Component";

/**
 * Returns the URI for a user's thumbnail based on the associated portal and the item data
 * @param portal - 4x or shimmed portal that the item is associated with
 * @param user - the user to determine the thumbnail URI for
 */
export const getUserThumbnail = (portal: Pojo, user: Pojo) => {
    if (user.thumbnail) {
        return `${portal.restUrl}/community/users/${user.username}/info/${user.thumbnail}${portal.credential ? `?token=${portal.credential.token}` : ""}`;
    }
    return undefined;
};

/**
 * (Curried, arity 2) Returns new user JSON containing the thumbURI for the user
 * 1. 4x or shimmed portal that the user is associated with
 * 2. the user JSON to mix thumbURI into
 */
export const mixinUserThumbnail = curry((portal: Pojo, user: Pojo) => ({
    ...user,
    thumbURI: getUserThumbnail(portal, user)
}));
    