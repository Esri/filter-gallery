import { getOrgBaseUrl } from "./baseUrl";
import { Pojo } from "../../../Component";

/**
 * Returns the thumbURI for an org based on its raw, unadulturated JSON
 * @param organization - raw self JSON for an org, fresh from the sharing API
 */
export const getOrgThumbnail = (organization: Pojo) => {
    const baseUrl = getOrgBaseUrl(organization);
    if (!!organization.thumbnail) {
        return `${baseUrl}/sharing/rest/portals/${organization.id}/resources/${organization.thumbnail}`;
    }
    return `${baseUrl}/home/images/group-no-image.png`;
};

/**
 * Returns new organization JSON containing the thumbURI which applies to the org
 * @param organization - the org JSON to mix thumbURI into
 */
export const mixinOrgThumbnail = (organization: Pojo) => ({
    ...organization,
    thumbURI: getOrgThumbnail(organization)
});
