import * as Deferred from "dojo/Deferred";
import {
    fetchGroupByQuery,
    fetchGroupCategorySchema,
    fetchItemData,
    requestJSON,
    Request
} from "./general";
import { Pojo } from "../../../Component";

/**
 * Retrieve the item containing the living atlas categories
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param groupId - group id to query for categories
 * @param typekeywords - typekeywords for item containing LA categories
 */
export const fetchLivingAtlasCategoryItem = (
    request: Request,
    portal: Pojo,
    groupId: string,
    typekeywords: string
) =>
    requestJSON(
        request, 
        `${portal.restUrl}/content/groups/${groupId}/search`, 
        { q: `typekeywords: ${typekeywords}` }
    );

/**
 * Retrieve the regions for a particular portal
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param culture - optional string representing the culture for which to obtain regions
 */
export const fetchPortalRegions = (request: Request, portal: Pojo, culture?: string) =>
    requestJSON(request, `${portal.restUrl}/portals/regions`, { culture });

/**
 * Retrieve the living atlas group ID, category schema and region schema
 * @param request - 4x or shimmed request
 * @param portal - 4x or shimmed portal to query
 * @param defaultSelf - self response with default set to true
 * @param locale - string representing the locale for which the living atlas categories should be retrieved
 */
export const fetchAllLivingAtlasInfo = (
    request: Request,
    portal: Pojo,
    defaultSelf: Pojo,
    locale: string = "en"
) => {
    const dfd = new Deferred();

    let livingAtlasGroupId: any;
    let livingAtlasCategoryTypeKeywords: any;
    let livingAtlasCategorySchema: any;
    let livingAtlasRegionSchema: any;

    fetchGroupByQuery(request, portal, defaultSelf.livingAtlasGroupQuery)
        .then(handleLAGroupSuccess, handleLivingAtlasError);

    return dfd;

    function handleLAGroupSuccess(response: any) {
        if (response.results[0] && response.results[0].id) {
            livingAtlasGroupId = response.results[0].id;

            fetchGroupCategorySchema(request, portal, livingAtlasGroupId)
                .then(handleLASchemaSuccess, handleLivingAtlasError);
        } else {
            handleLivingAtlasError("The living atlas group could not be found.");
        }
    }

    function handleLASchemaSuccess(response: any) {
        livingAtlasCategoryTypeKeywords = response.categorySchema[0].source.split(".")[1];
        fetchGroupByQuery(request, portal, defaultSelf.contentCategorySetsGroupQuery)
            .then(handleCategorySetsGroupSuccess, handleLivingAtlasError);

        fetchPortalRegions(request, portal, locale)
            .then(handlePortalRegionSuccess, handleLivingAtlasError);
    }

    function handleCategorySetsGroupSuccess(response: any) {
        if (response.results[0]) {
            fetchLivingAtlasCategoryItem(request, portal, response.results[0].id, livingAtlasCategoryTypeKeywords)
                .then(handleLACategoryItemSuccess, handleLivingAtlasError);
        } else {
            handleLivingAtlasError("The content category sets group could not be found.");
        }
    }

    function handleLACategoryItemSuccess(response: any) {
        if (response.results.length === 1 && response.results[0]) {
            fetchItemData(request, portal, response.results[0].id)
                .then(handleLAItemDataSuccess, handleLivingAtlasError);
        } else {
            handleLivingAtlasError("The item containing the living atlas categories could not be determined.");
        }
    }

    function handleLAItemDataSuccess(response: any) {
        livingAtlasCategorySchema = response.categorySchema[0];

        if (defaultSelf.isPortal && !!livingAtlasRegionSchema) {
            handleLivingAtlasCategorySchemaSuccess([livingAtlasCategorySchema]);
        } else if (!!livingAtlasRegionSchema) {
            handleLivingAtlasCategorySchemaSuccess([livingAtlasCategorySchema, livingAtlasRegionSchema]);
        }
    }

    function handlePortalRegionSuccess(response: any) {
        const regions = response.map((region: any) => ({
            displayName: region.localizedName,
            title: region.region
        })).sort(function(a: { displayName: string, title: string }, b: { displayName: string, title: string }) {
            if (a.title.toLowerCase() === "wo") {
                return -1;
            }
            return a.displayName.localeCompare(b.displayName);
        });

        livingAtlasRegionSchema = {
            categories: regions,
            description: "2.0",
            displayName: "Regions",
            title: "region"
        };
        
        if (defaultSelf.isPortal && !!livingAtlasCategorySchema) {
            handleLivingAtlasCategorySchemaSuccess([livingAtlasCategorySchema]);
        } else if (!!livingAtlasCategorySchema) {
            handleLivingAtlasCategorySchemaSuccess([livingAtlasCategorySchema, livingAtlasRegionSchema]);
        }
    }

    function handleLivingAtlasCategorySchemaSuccess(schema: any[]) {
        dfd.resolve({ schema, id: livingAtlasGroupId });
    }

    function handleLivingAtlasError(err: any) {
        dfd.reject(err);
    }
};
