import { curry, compose } from "../../../_utils";
import { FilterGalleryState } from "../../../_reducer";
import { getQ, getCountsQ, getTagsQ } from "./qHelpers";

export type RequestArgs = [string, {
    method: string;
    query: {
        bbox?: string,
        countFields?: string,
        countSize?: number,
        f?: string,
        num?: number,
        q?: string,
        sortField?: string,
        sortOrder?: string
        start?: number,
    }
}];

/**
 * Forms a request for the search based on the current state of the item browser
 * @param options options object containing 'start' and/or 'num' parameter to pass into request
 * @param state current state of the item browser
 */
export function getSearchRequest(options: { start?: number, num?: number }, state: FilterGalleryState): RequestArgs {
    const requestBase: RequestArgs = [
        "",
        {
            method: "get",
            query: {
                f: "json",
                q: getQ(state),
                num: options.num ? options.num : state.settings.config.resultsPerQuery,
                sortOrder: state.parameters.sort.order,
                start: options.start ? options.start : 1
            }
        }
    ];

    return mixinSearchParams(state)(requestBase);
}

/**
 * Forms a request for counts aggregations based on the current state of the item browser
 * @param state current state of the item browser
 */
export function getCountsRequest(state: FilterGalleryState, countFields: string[]): RequestArgs {
    const requestBase: RequestArgs = [
        "",
        {
            method: "get",
            query: {
                f: "json",
                q: getCountsQ(state),
                num: 0,
                countFields: countFields.join(", "),
                countSize: 200
            }
        }
    ];

    return mixinCountParams(state)(requestBase);
}

/**
 * Forms a request for counts aggregations based on the current state of the item browser and a particular tag
 * @param state current state of the item browser
 * @param tagName tag to search for in the results
 */
export function getTagsRequest(state: FilterGalleryState, tagName: string): RequestArgs {
    const requestBase: RequestArgs = [
        "",
        {
            method: "get",
            query: {
                f: "json",
                q: getTagsQ(state, tagName),
                num: 0,
                countFields: "tags",
                countSize: 200
            }
        }
    ];

    return mixinCountParams(state)(requestBase);
}

/**
 * Mixes the appropriate search parameters into the arguments for request
 * based on the current state of the item browser
 * @param state current state of the item browser
 */
const mixinSearchParams = (state: FilterGalleryState) => compose(
    mixinRequestSort(state),
    mixinRequestUrl(state)
);


/**
 * Mixes the appropriate counts parameters into the arguments for request
 * based on the current state of the item browser
 * @param state current state of the item browser
 */
const mixinCountParams = (state: FilterGalleryState) => compose(
    mixinRequestUrl(state)
);

/**
 * Returns new request arguments with sortField set based on the state of the item browser
 * @param state the current state of the item browser
 * @param requestArgs the existing arguments for request
 */
const mixinRequestSort = curry((state: FilterGalleryState, [ url, parameters ]: RequestArgs): RequestArgs => {
    const sortField = state.parameters.sort.field;
    if (sortField !== "relevance") { // relevance is the same as no sort field
        return [
            url,
            {
                ...parameters,
                query: {
                    ...parameters.query,
                    sortField
                }
            }
        ];
    }
    return [url, parameters];
});

/**
 * Returns new request arguments with url set based on the state of the item browser
 * @param state the current state of the item browser
 * @param requestArgs the existing arguments for request
 */
const mixinRequestUrl = curry((state: FilterGalleryState, [ foo, parameters ]: RequestArgs): RequestArgs => {
    const { filter } = state.parameters;
    const portal = state.settings.utils.portal;
    const section = state.settings.config.section;
    let url = `${portal.restUrl}/content/groups/${section.id}/search`;
    if (!!filter.categories) {
        url = url + `?categories=${encodeURIComponent(JSON.stringify([filter.categories.value]))}`;
    }

    return [ url, parameters ];
});
