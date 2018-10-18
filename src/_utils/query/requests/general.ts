import * as all from "dojo/promise/all";
import { Pojo } from "../../../Component";
export type Request = (url: string, options?: Pojo) => dojo.Deferred<any>;

/**
 * Fetch self for the current portal
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param culture - optional string representing the culture
 */
export const fetchSelf = (request: Request, portal: Pojo, culture?: string) =>
    requestJSON(request, `${portal.restUrl}/portals/self`, { culture, default: true });

/**
 * Fetch an item's data using its id
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param itemId - id of the item to get data for
 */
export const fetchItemData = (request: Request, portal: Pojo, itemId: string) => 
    requestJSON(request, `${portal.restUrl}/content/items/${itemId}/data`);

/**
 * Fetch a group using a query string (groups are often provided in this format by the self response)
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param searchQuery - query string
 */
export const fetchGroupByQuery = (request: Request, portal: Pojo, searchQuery: string) => 
    requestJSON(request, `${portal.restUrl}/community/groups`, { q: searchQuery });

/**
 * Fetch category schema for a specified group
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param groupId - id of the group to fetch category schema for
 */
export const fetchGroupCategorySchema = (request: Request, portal: Pojo, groupId: string) => 
    requestJSON(request, `${portal.restUrl}/community/groups/${groupId}/categorySchema`);

/**
 * Fetch category schema for the specified organization
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param id - optional id of portal to query
 */
export const fetchOrgCategorySchema = (request: Request, portal: Pojo, id?: string) =>
    requestJSON(request, `${portal.restUrl}/portals/${id ? id : portal.id}/categorySchema`);

/**
 * Fetch info for the specified portal
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param id - optional id of portal to query
 */
export const fetchOrgInfo = (request: Request, portal: Pojo, id?: string) =>
    requestJSON(
        request,
        `${location.protocol}//${portal.portalHostname}/sharing/rest/portals/${id ? id : portal.id}`
    );

/**
 * Fetch all groups associated with the current organization (series)
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param orgid - optional id if querying a different org than is associated with the portal
 * @param start - optional startnum for paging
 */
export const fetchAllOrgGroups = (request: Request, portal: Pojo, start?: number): any => (
    request(
        `${portal.restUrl}/community/groups`,
        {
            query: {
                f: "json",
                q: `orgid:${portal.id} AND access:public`,
                num: 100,
                start: start ? start : 1,
                sortField: "title",
                sortOrder: "asc"
            }
        }
    ).then((response: any) => {
        if (response.data.total > response.data.start + response.data.num) {
            return fetchAllOrgGroups(request, portal, response.data.start + response.data.num)
                .then((response2: any) => {
                    return {
                        ...response2,
                        data: {
                            ...response2.data,
                            results: response.data.results.concat(response2.data.results)
                        }
                    };
                });
        }
        return response;
    })
);

/**
 * Fetch all provisioned listings for a specified user
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param username - username to fetch provisioned listings for
 * @param start - optional startnum for paging
 */
export const fetchAllProvisionedContent = (
    request: Request,
    portal: Pojo,
    username: string,
    start?: number
): any => (
    request(
        `${portal.restUrl}/community/users/${username}/provisionedListings`,
        {
            query: {
                f: "json",
                num: 100,
                start: start ? start : 1
            }
        }
    ).then((response: any) => {
        const relatedItemRequests = response.data.provisionedListings.map((listing: any) => (
            requestJSON(
                request,
                `${portal.restUrl}/content/items/${listing.id || listing.itemId}/relatedItems?relationshipType=Listed2ImplicitlyListed&direction=forward`
            ).then(
                (related: any) => related,
                (err) => undefined
            )
        ));
        if (response.data.total > response.data.start + response.data.num) {
            return fetchAllProvisionedContent(request, portal, username, response.data.start + response.data.num)
                .then((response2: any) => {
                    return all(
                        relatedItemRequests
                    ).then(
                        (responses: any[]) => {
                            return response2.concat(
                                response.data.provisionedListings
                                    .filter((listing: any) => !!listing.itemId)
                                    .map((listing: any) => listing.itemId)
                                    .concat(concatenateRelatedItems(responses))
                            );
                        }
                    );
                });
        }
        return all(
            relatedItemRequests
        ).then(
            (responses: any[]) => {
                return response.data.provisionedListings
                    .filter((listing: any) => !!listing.itemId)
                    .map((listing: any) => listing.itemId)
                    .concat(concatenateRelatedItems(responses));
            }
        );
    })
);

function concatenateRelatedItems(responses: ({ relatedItems: { id: string }[] } | undefined)[]) {
    return responses.reduce((result: string[], current: any) => {
        if (current && current.relatedItems) {
            return result.concat(current.relatedItems.map((item: any) => item.id));
        }
        return result;
    }, []);
}

/**
 * Fetch a user's data base on username
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param username - username to get data for
 */
export const fetchUser = (request: Request, portal: Pojo, username?: string) => 
    requestJSON(request, `${portal.restUrl}/community/users/${username ? username : portal.user.username}`);

/**
 * Fetch a user's content based on username
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param username - username to get content for
 */
export const fetchUserContent = (request: Request, portal: Pojo, username?: string) =>
    requestJSON(request, `${portal.restUrl}/content/users/${username ? username : portal.user.username}`);

/**
 * Fetch a user's favorites using the favorites group id
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param favGroupId - id of the group containing the favorites
 */
export const fetchUserFavorites = (request: Request, portal: Pojo, favGroupId: string) =>
    requestJSON(request, `${portal.restUrl}/content/groups/${favGroupId}`);

/**
 * Query for groups using the specified query parameters
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param queryParams - additional query parameters
 */
export const fetchGroups = (request: Request, portal: Pojo, queryParams: Pojo) =>
    requestJSON(request, `${portal.restUrl}/community/groups`, queryParams);

/**
 * Query for a group by id
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param id - id of the group
 */
export const fetchGroupById = (request: Request, portal: Pojo, id: string) =>
    requestJSON(request, `${portal.restUrl}/community/groups/${id}`);

/**
 * Fetch an item by id
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param id - id of the item
 */
export const fetchItemById = (request: Request, portal: Pojo, id: string) =>
    requestJSON(request, `${portal.restUrl}/content/items/${id}`);

/**
 * Query a portal for JSON
 * @param request - 4x or shimmed request
 * @param url - url to query 
 * @param queryParams - optional object with query parameters
 */
export function requestJSON(request: Request, url: string, queryParams?: Pojo) {
    return request(
        url,
        {
            query: {
                f: "json",
                ...queryParams
            }
        }
    ).then((response: any) => response.data);
}
