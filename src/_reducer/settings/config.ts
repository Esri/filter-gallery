import * as i18n from "dojo/i18n!../../nls";

import { Pojo, Action } from "../../Component";
import { allItemTypes, ItemType, ItemTypeFilter } from "../../_utils";
import { SortField } from "../../components/Dropdowns/SortDropdown";
import { FilterGalleryStore } from "../..";
import defaultActions from "./_utils/defaultActions";
import { FilterGalleryState } from "..";
import { LOAD_PORTAL_SUCCESS } from "../../_actions";

export type BaseFilters = "itemType" | "modified" | "created" | "shared" | "status" | "tags";

/**
 * A custom action to perform from applicable items
 */
export interface CustomAction {
    /**
     * Predicate function determining whether or not this action is allowed (will be shown) for the item.
     * - e.g. `(item) => item.type === "Map Package"`
     * @type {function}
     */
    allowed: (item: Pojo, state?: FilterGalleryState) => boolean;

    /**
     * If set to true, item will be in a loading state until a promise returned to callback is resolved or rejected.
     * - If this option is set to true, `onAction` must return a dojo deferred.
     * @type {boolean}
     */
    asynchronous: boolean;

    /**
     * Callback executed when this action is performed on an item.
     * - If `asynchronous` is set to true, this must return a dojo deferred.
     * @type {function}
     * @default no-op
     */
    onAction: (item: Pojo, state: FilterGalleryState, dispatch: FilterGalleryStore["dispatch"]) => any;

    /**
     * Unique name for the custom action.
     * @type {string}
     */
    name: string;

    /**
     * Inline SVG to use as icon for this action.
     * - Note: Markup supplied here is injected directly into the DOM. Exposing control of this option to
     * the end user is an XSS vulnerability, so don't do it :)
     * @type {string}
     * @default undefined
     */
    icon?: string;
    /**
     * If set, will render a link with the appropriate href rather than firing the `onAction` callback.
     * @type {function}
     * @default undefined
     */
    href?: (item: Pojo, state: FilterGalleryState) => string;
    /**
     * Optional target for the action's rendered link.
     * @type {string}
     * @default undefined
     */
    target?: string;
    /**
     * If provided, this id will be appended to the item id to produce an id for the action button.
     * @type {string}
     */
    id?: string;
}

/**
 * A filter matching the shape of the defined content categories from a specified org or group
 */
export interface CategoryFilter {
    /**
     * The name of the filter to display in the UI.
     * @type {string}
     */
    name: string;

    /**
     * If set to a group search query, the item browser will determine the id for the group based on the first
     * result matching the query.
     * - This option is only functional if `type` is set to `group`.
     * - The `id` option specified is irrelevant if this options is enabled.
     * @type {string}
     * @default undefined
     */
    fetchGroupIdByQuery?: string;

    /**
     * Optional path to navigate to from the root of the category schema.
     * - Category schemas are stored as trees on the backend. Category schemas set through the home app UI are
     * stored in the first child node of the root, and are named `categories`. For this type of schema you would set
     * this option equal to `["categories"]`. If you wish to use a different node, set it's path from the root here. For
     * example `["foo", "bar", "baz"]` would show categories from a great-grandchild node named `baz` with
     * parent `bar` having a parent `foo` immediately below the root node.
     * @type {array}
     * @default undefined
     */
    path?: string[];
}

/**
 * A custom section to display items from
 */
export interface CustomSection {
    /**
     * Unique name for the custom section.
     * This is the displayed name, and must distinguish the section from any other sections.
     * @type {string}
     */
    name: string;

    /**
     * Base query for the custom section. Use this to narrow the query to a particular scope.
     * @type {string}
     */
    baseQuery: string;

    /**
     * ID of the group for this custom section.
     * @type {string}
     */
    id: string;

    /**
     * Filters for the custom section.
     * Custom filters can be of type
     * [CategoryFilter](https://devtopia.esri.com/WebGIS/arcgis-components/wiki/ItemBrowser-Documentation),
     * [CustomFilterTree](https://devtopia.esri.com/WebGIS/arcgis-components/wiki/ItemBrowser-Documentation),
     * or one of the following base filters:
     * - `itemType`, `modified`, `created`, `shared`, `status`, `tags`
     * @type {array}
     * @default ["itemType","modified","shared"]
     */
    filters: (CategoryFilter | BaseFilters)[];
}

export interface ConfigState {
    /**
     * String used as the title of the dialog
     * Note: This is not visible in the default side panel view of the item browser unless the
     * `replaceSectionDropdownWithTitle` option is enabled. It is visible if `layoutMode` is set to `fullscreen`
     * @type {string}
     * @default "Category Gallery"
     */
    dialogTitle: string;

    /**
     * Batch size for each search query.
     * @type {number}
     * @default 10
     */
    resultsPerQuery: number;

    /**
     * Array of strings representing permitted item types for the search.
     * - Note: Filters will always operate within the constraints defined by this option.
     * You must set the `allowedItemTypes` option in a way that makes sense for your application.
     * For item types see http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000ms000000
     * @type {array}
     * @default all
     */
    allowedItemTypes: ItemType[];

    /**
     * Array of strings representing the item type filters that should be available in the UI.
     * - Options: `maps`, `webMaps`, `mapFiles`, `layers`, `featureLayers`, `tileLayers`, `mapImageLayers`,
     * `imageryLayers`, `sceneLayers`, `tables`, `layerFiles`, `scenes`, `apps`, `webApps`, `mobileApps`, `desktopApps`,
     * `tools`, `locators`, `geodatabaseAccess`, `geometricOperations`, `geoprocessingTasks`, `networkAnalysis`,
     * `files`, `documents`, `images`, `pdfs`, `notebooks`.
     * @type {array}
     * @default all
     */
    availableItemTypeFilters: ItemTypeFilter[];

    /**
     * Array of custom actions that will appear in the item details pane and on item cards.
     * @type {array}
     * @default []
     */
    customActions: CustomAction[];

    /**
     * Array of custom sections that will appear in the section dropdown.
     * @type {object}
     */
    section: CustomSection;

    /**
     * Array of filters that will default open in the section dropdown.
     * - options: `categories`, `itemType`, `created`, `modified`, `shared`, `status`, `tags`
     * @type {array}
     * @default []
     */
    filtersDefault: String[];

    /**
     * Array of sort options available in the gallery.
     * - options: `relevance`, `title`, `created`, `type`, `owner`, `modified`, `avgrating`, `numcomments`, `numviews`
     * @type {array}
     * @default ["relevance","title","owner","created","modified","numviews"]
     */
    sortOptions: SortField[];

    /**
     * Placeholder text for the search input.
     * @type {string}
     * @default "Enter search terms"
     */
    searchPlaceholderText: string;

    /**
     * Include sign in button in header.
     * @type {boolean}
     * @default false
     */
    showSignInBtn: boolean;

    /**
     * Widgets to add to the map or scene. To hide the widget set to an empty string.
     * To show the widget, set the property for the widget to
     * `top-left`, `top-right`, `bottom-left`, or `bottom-right`. 
     * @type {object}
     */
    widgets: {
        compassWidget: string;
        homeWidget: string;
        legendWidget: string;
        locateWidget: string;
        searchWidget: string;
        basemapGalleryWidget: string;
    };

    /**
     * Basemap to use for layer viewer
     * @type {string}
     * @default streets-vector
     */
    defaultBasemap: string;

    /**
     * Url for the portal which contains the group being queried.
     * @type {string}
     */
    url: string;

    /**
     * If enabled, will use the categories for the configuring organization rather than the group.
     * @type {boolean}
     * @default false
     */
    useOrgCategories: boolean;

    /**
     * HTML to inject into the header.
     * @type {string}
     */
    headHTML?: string;

    /**
     * CSS to inject onto the page.
     * @type {string}
     */
    customCSS?: string;
}

export const initialState: ConfigState = {
    dialogTitle: "Filter Gallery",
    resultsPerQuery: 16,
    allowedItemTypes: allItemTypes,
    availableItemTypeFilters: [
        "maps",
        "webMaps",
        "mapFiles",
        "layers",
        "featureLayers",
        "tileLayers",
        "mapImageLayers",
        "imageryLayers",
        "sceneLayers",
        "tables",
        "layerFiles",
        "scenes",
        "apps",
        "webApps",
        "mobileApps",
        "desktopApps",
        "tools",
        "locators",
        "geodatabaseAccess",
        "geometricOperations",
        "geoprocessingTasks",
        "networkAnalysis",
        "files",
        "documents",
        "images",
        "pdfs",
        "notebooks"
    ],
    customActions: defaultActions,
    defaultBasemap: "streets-vector",
    section: {
        name: "doesnt matter",
        baseQuery: "",
        filters: [
            {
                name: "Categories",
                path: ["categories"]
            },
            "itemType",
            "created",
            "modified",
            "shared",
            "status",
            "tags"
        ],
        id: "8de7d7e7162549f3960f3094754dbe37"
    },
    filtersDefault: [],
    sortOptions: ["relevance", "title", "owner", "created", "modified", "numviews"],
    searchPlaceholderText: i18n.defaultPlaceholder,
    showSignInBtn: false,
    widgets: {
        compassWidget: "",
        homeWidget: "",
        legendWidget: "",
        locateWidget: "top-left",
        searchWidget: "top-right",
        basemapGalleryWidget: ""
    },
    url: "https://devext.arcgis.com",
    useOrgCategories: false
};

export default (state: ConfigState = initialState, action: Action) => {
    switch (action.type) {
        case LOAD_PORTAL_SUCCESS:
            const { config } = action.payload;

            // Inject custom stylesheet if provided
            if (config.customCSS && config.customCSS.length > 0) {
                const customStyle = document.createElement("style");
                customStyle.innerHTML = config.customCSS;
                document.body.appendChild(customStyle);
            }

            //Set locale & direction
            document.documentElement.lang = action.payload.locale;
            var dirNode = document.getElementsByTagName("html")[0];
            dirNode.setAttribute("dir", action.payload.direction);

            return {
                ...state,
                url: config.portalUrl,
                dialogTitle: config.title,
                resultsPerQuery: config.resultsPerQuery,
                allowedItemTypes: config.allowedItemTypes,
                defaultBasemap: config.defaultBasemap,
                widgets: {
                    "compassWidget": config.compassWidget,
                    "homeWidget": config.homeWidget,
                    "legendWidget": config.legendWidget,
                    "locateWidget": config.locateWidget,
                    "searchWidget": config.searchWidget,
                    "basemapGalleryWidget": config.basemapGalleryWidget,
                },
                useOrgCategories: config.useOrgCategories,
                sortOptions: config.sortOptions,
                availableItemTypeFilters: config.availableItemTypeFilters,
                headHTML: config.headHTML.length > 0 ? config.headHTML : undefined,
                section: {
                    name: "doesn't matter!",
                    baseQuery: "",
                    filters: config.filters.map(
                        (filter: string) =>
                            filter === "categories" ? ({
                                name: "Categories",
                                path: ["categories"]
                            }) : filter
                    ),
                    id: config.group
                },
                filtersDefault: config.filtersDefault,
                group: config.group,
                showSignInBtn: config.showSignInBtn
            };
        default:
            return state;
    }
};
