import { getOrgBaseUrl } from "./baseUrl";
import { Pojo } from "../../../Component";

/**
 * Returns the url for an org based on its raw, unadulturated JSON
 * @param organization - raw self JSON for an org, fresh from the sharing API
 */
export const getOrgUrl = (organization: Pojo) =>
    `${getOrgBaseUrl(organization)}/home/index.html`;

/**
 * Returns new organization JSON containing the orgUrl which applies to the org
 * @param organization - the org JSON to mix orgUrl into
 */
export const mixinOrgUrl = (organization: Pojo) => ({
    ...organization,
    orgUrl: getOrgUrl(organization)
});
