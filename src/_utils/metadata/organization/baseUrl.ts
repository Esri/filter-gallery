import { Pojo } from "../../../Component";

/**
 * Returns the baseUrl for an org based on its raw, unadulturated JSON
 * @param organization - raw self JSON for an org, fresh from the sharing API
 */
export const getOrgBaseUrl = (organization: Pojo) =>
    organization.urlKey ?
        `${location.protocol}//${organization.urlKey}.${organization.customBaseUrl}` :
        `${location.protocol}//${organization.portalHostname}`;

/**
 * Returns new organization JSON containing the baseUrl which applies to the org
 * @param organization - the org JSON to mix baseUrl into
 */
export const mixinOrgBaseUrl = (organization: Pojo) => ({
    ...organization,
    baseUrl: getOrgBaseUrl(organization)
});
