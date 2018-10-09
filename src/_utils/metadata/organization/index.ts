import { compose } from "../../functional/index";
import { mixinOrgBaseUrl } from "./baseUrl";
import { mixinOrgThumbnail } from "./thumbnail";
import { mixinOrgUrl } from "./url";

export * from "./baseUrl";
export * from "./thumbnail";
export * from "./url";

export const mixinOrgInfo = compose(
    mixinOrgThumbnail,
    mixinOrgUrl,
    mixinOrgBaseUrl
);
