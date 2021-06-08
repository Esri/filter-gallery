import Deferred = require("dojo/Deferred");
import all = require("dojo/promise/all");
import { curry, fetchOrgInfo, mixinOrgInfo, removeDups } from "../../_utils/index";
import { FilterGalleryState } from "../../_reducer/index";
import { Pojo } from "../../Component";

export const UPDATE_ORGANIZATIONS = "UPDATE_ORGANIZATIONS";

export const mixinOrganizationInfo = curry((state: FilterGalleryState, response: any) => {
    const request = state.settings.utils.request;
    const portal = state.settings.utils.portal;
    const dfd = new Deferred();
    
    const orgRequests = response.data.results
        .filter((item: Pojo) => !!item.orgId && !state.results.allOrganizations[item.orgId])
        .map((item: Pojo) => item.orgId)
        .filter(removeDups)
        .map((orgId: string) => fetchOrgInfo(request, portal, orgId));
    
    all(orgRequests).then((orgResponses: any) => {
        dfd.resolve({
            ...response,
            data: {
                ...response.data,
                organizations: orgResponses.reduce((result: Pojo, current: Pojo) => {
                    return {
                        ...result,
                        [current.id]: mixinOrgInfo(current)
                    };
                }, {})
            }
        });
    }, (err) => { dfd.reject(err) });

    return dfd;
});
