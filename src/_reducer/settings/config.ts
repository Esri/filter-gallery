import { Pojo, Action } from "../../Component";
import { allItemTypes, ItemType, ItemTypeFilter } from "../../_utils";

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
    allowed: (item: Pojo) => boolean;
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
    onAction: (item: Pojo) => any;
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
    filters?: (CategoryFilter | BaseFilters)[];
}

export interface ConfigState {
    /**
     * String used as the title of the dialog
     * Note: This is not visible in the default side panel view of the item browser unless the
     * `replaceSectionDropdownWithTitle` option is enabled. It is visible if `layoutMode` is set to `fullscreen`
     * @type {string}
     * @default "Item Browser"
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
}

export const initialState: ConfigState = {
    dialogTitle: "Filter Gallery",
    resultsPerQuery: 10,
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
    customActions: [],
    section: {
        name: "Living Atlas",
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
        id: "abc12345678"
    }
};

export default (state: ConfigState = initialState, action: Action) => state;
