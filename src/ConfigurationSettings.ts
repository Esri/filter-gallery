import {
    property,
    subclass
} from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");
import { ApplicationConfig } from "./_applicationBase/interfaces";

import { allItemTypes, ItemType, ItemTypeFilter } from "./_utils";

// type UIPosition = 
//     | "top-left"
//     | "top-right"
//     | "bottom-left"
//     | "bottom-right"
//     | "top-leading"
//     | "top-trailing"
//     | "bottom-leading"
//     | "bottom-trailing";

export interface UIPosition {
    fieldName?: string;      // Identifier for Widget being positioned. Ex: "searchPosition"
    position: 
      | "bottom-leading"
      | "bottom-left"
      | "bottom-right"
      | "bottom-trailing"
      | "top-leading"
      | "top-left"
      | "top-right"
      | "top-trailing"
      | "manual";       // ui location. Ex: "top-leading"
    index?: number;         // index for the particular ui section
    enabledState?: boolean; // indicates whether positioned widget is shown enabled to be shown on the map UI
    label?: string;         // label in Position Manager
}

@subclass("app.ConfigurationSettings")
class ConfigurationSettings extends Accessor {
    @property()
    group: string;

    @property()
    title: string;

    @property()
    displayDefault: string;

    @property()
    headHTML: string;

    @property()
    customCSS: string;

    @property()
    filterPaneDefault: boolean;

    @property()
    allowedItemTypes: string;

    @property()
    allowedItemTypesArray: ItemType[];

    @property()
    resultsPerQuery: number;

    @property()
    showSignInBtn: boolean;

    @property()
    filters: string[];

    @property()
    filtersDefault: string[];

    @property()
    availableItemTypeFilters: ItemTypeFilter[];

    @property()
    useOrgCategories: boolean;

    @property()
    showItemType: boolean;

    @property()
    showItemOwner: boolean;

    @property()
    showItemInfo: boolean;

    @property()
    showItemDetails: boolean;

    @property()
    showItemToolTip: boolean;

    @property()
    itemSummaryMaxChar: number;

    @property()
    defaultBasemap: string;

    @property()
    compassWidget: boolean;

    @property()
    compassWidgetPosition: UIPosition;

    @property()
    basemapToggle: boolean;

    @property()
    basemapTogglePosition: UIPosition;

    @property()
    nextBasemap: string;

    @property()
    search: boolean;

    @property()
    searchPosition: UIPosition;

    @property()
    locateWidget: boolean;

    @property()
    locateWidgetPosition: UIPosition;

    @property()
    home: boolean;

    @property()
    homePosition: UIPosition;

    @property()
    legend: boolean;

    @property()
    legendPosition: UIPosition;

    // @property()
    // searchConfiguration: any;

    @property()
    share: boolean;

    @property()
    googleAnalytics: boolean;
    @property()
    googleAnalyticsKey: string;
    @property()
    googleAnalyticsConsentMsg: string;
    @property()
    googleAnalyticsConsent: boolean;
    @property()
    telemetry: any;

    @property()
    theme: string;

    @property()
    withinConfigurationExperience: boolean =
        window?.frameElement?.getAttribute("data-embed-type") === "instant-config";

    @property()
    draftChanges: boolean;

    _storageKey = "config-values";
    _draft: ApplicationConfig = {};
    _draftMode: boolean = false;
    _handleConfigurationUpdates: Function; 
    _appliedDraft: boolean = false;

    constructor(params?: ApplicationConfig) {

        super(params);
        this._draft = params?.draft;
        this._draftMode = true; // params?.mode === "draft";
    }
    initialize() {
        if (this.withinConfigurationExperience || this._draftMode) {
            // Apply any draft properties
            if (this._draft) {
                Object.assign(this, this._draft);
            }

            // ensured to only call once
            if (this._handleConfigurationUpdates === undefined) {
                this._handleConfigurationUpdates = this.handleConfigurationUpdates;
                window.addEventListener(
                    "message",
                    ((e: MessageEvent) => {
                        this._handleConfigurationUpdates(e);
                    }).bind(this),
                    false
                );
            }
        }
    }

    async applyDraft() {
        if ((this.withinConfigurationExperience || this._draftMode) && !this._appliedDraft) {
            // Apply any draft properties
            if (this._draft) {
                Object.assign(this, this._draft);
                this._appliedDraft = true;
            }
        }
        return Promise.resolve();
    }

    handleConfigurationUpdates(e: MessageEvent) {
        if (e?.data?.type === "cats-app") {
            Object.assign(this, e.data);
            window.postMessage({type: "rerender"}, window.origin);
        }
    }

    toObjectLiteral() {
        const object = {};
        const propsMap = this["__accessor__"].properties;
        const propsObj = Array.from(propsMap).reduce((obj, [key, value]) => (
            Object.assign(obj, { [key]: value }) 
          ), {});
        const keys = Object.keys(propsObj);
        keys.forEach(key => {
            if (this[key] !== undefined && this[key] !== "") {
                object[key] = this[key];
            }
        });
        return object;
    }
}
export default ConfigurationSettings;