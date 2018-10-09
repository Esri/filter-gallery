import { compose } from "../../functional/index";
import { mixinUserThumbnail } from "./thumbnail";
import { Pojo } from "../../../Component";

export * from "./thumbnail";

export const mixinUserInfo = (portal: Pojo, user: Pojo) => compose(
    mixinUserThumbnail(portal)
)(user);