import { Pojo } from "../../../Component";

export type BadgeType = (
    "authoritative" |
    "deprecated" |
    "livingAtlas" |
    "marketplace" |
    "openData" |
    "premium" |
    "subscriber"
);

/**
 * Returns an array of badge types which apply to an item
 * @param item - raw JSON for the item to determine badges
 */
export const getItemBadges = (item: Pojo): BadgeType[] => {
    let badges: BadgeType[] = [];
    let typeKeywords = item.typeKeywords ? item.typeKeywords : [];

    if (item.contentStatus) {
        if (item.contentStatus === "org_authoritative" || item.contentStatus === "public_authoritative") {
            badges.push("authoritative");
        } else if (item.contentStatus === "deprecated") {
            badges.push("deprecated");
        }
    }

    if (item.groupDesignations && item.groupDesignations.indexOf("livingatlas") > -1) {
        badges.push("livingAtlas");
    }

    if (typeKeywords.indexOf("Requires Credits") > -1) {
        badges.push("premium");
    } else if (typeKeywords.indexOf("Requires Subscription") > -1) {
        badges.push("subscriber");
    }

    return badges;
};

/**
 * Returns new item JSON containing the badge types which apply to the item
 * @param item - the item JSON to mixin badges for
 */
export const mixinItemBadges = (item: Pojo) => ({ ...item, badges: getItemBadges(item) });
