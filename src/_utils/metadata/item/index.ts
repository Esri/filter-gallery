import { compose, scrubObjectProperty } from "../../functional";
import { mixinItemBadges } from "./badge";
import { mixinItemDisplayName } from "./displayName";
import { mixinItemIcon } from "./icon";
import { mixinPatchedItemDescription } from "./patchedDescription";
import { mixinItemThumbnail } from "./thumbnail";
import { Pojo } from "../../../Component";

export * from "./badge";
export * from "./displayName";
export * from "./icon";
export * from "./patchedDescription";
export * from "./thumbnail";
export * from "./typeMap";

export const mixinItemInfo = (portal: Pojo, imgDir: string, item: Pojo) => compose(
    mixinItemThumbnail(portal),
    mixinPatchedItemDescription(portal),
    mixinItemIcon(imgDir),
    mixinItemDisplayName,
    mixinItemBadges
)(item);

/**
 * Scrubs item of any added information
 * 1. item - the item to scrub
 */
export const scrubItemInfo = compose(
    scrubObjectProperty("patchedDescription"),
    scrubObjectProperty("thumbURI"),
    scrubObjectProperty("iconURI"),
    scrubObjectProperty("displayName"),
    scrubObjectProperty("badges")
);
