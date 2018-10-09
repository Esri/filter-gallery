import { compose, scrubObjectProperty } from "../../functional/index";
import { mixinGroupThumbnail } from "./thumbnail";
import { Pojo } from "../../../Component";

export * from "./thumbnail";

export const mixinGroupInfo = (portal: Pojo, group: Pojo) => compose(
    mixinGroupThumbnail(portal)
)(group);

export const scrubGroupInfo = compose(
    scrubObjectProperty("thumbURI")
);