import * as Base from "./_applicationBase/ApplicationBase";

import {
    applyMiddleware,
    createStore,
    createProjector,
    createEpicMiddleware,
    H,
    Store,
    Pojo,
    addListener
} from "./Component";
import { rootEpic } from "./_epic";
import reducer, { initialState, FilterGalleryState } from "./_reducer";
import RootComponent from "./components/FilterGallery";
import { loadPortal } from "./_actions";
import { startHistoryListener, router } from "./router";

import ConfigurationSettings from "./ConfigurationSettings";

// import { ItemBrowserWrapper } from "arcgis-components/wrappers/ItemBrowser";
// import * as Portal from "esri/portal/Portal";
// import * as request from "esri/request";

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (cfg: string, settings: Pojo) => {
    let config = JSON.parse(cfg);

    // parse config for new config experience
    config = new ConfigurationSettings(config);
    config = parseConfigSettings(config);
    
    // Load the application base
    const base = new Base({ config, settings });
    const node = document.getElementById("viewDiv") as HTMLElement;
    const store: FilterGalleryStore = applyMiddleware(
        createEpicMiddleware(rootEpic),
        router,
        // addListener(console.log)
    )(createStore)(reducer, {
        ...initialState,
        settings: {
            ...initialState.settings,
            utils: {
                ...initialState.settings.utils,
                base
            }
        }
    });
    store.dispatch(loadPortal());
    startHistoryListener(store);
    createProjector(
        store,
        (tsx: H) => (<RootComponent key="root" />),
        node
    );

    // const portal = new Portal({ url: "https://devext.arcgis.com" });
    // // const container = document.querySelector("#myDomNode");
    // const myItemBrowser = new ItemBrowserWrapper(node, {
    //     apiVersion: 4,
    //     portal,
    //     request});
};

const originalConfig = [
    "appid",
    "oauthappid",
    "group",
    "portalUrl",
    "title",
    "showSignInBtn",
    "allowedItemTypes",
    "defaultBasemap",
    "compassWidget",
    "homeWidget",
    "legendWidget",
    "locateWidget",
    "searchWidget",
    "basemapGalleryWidget",
    "resultsPerQuery",
    "useOrgCategories",
    "displayDefault",
    "showItemOwner",
    "showItemInfo",
    "showItemDetails",
    "showItemType",
    "showItemToolTip",
    "itemSummaryMaxChar",
    "openDocumentInBrowser",
    "filterPaneDefault",
    "filters",
    "filtersDefault",
    "sortOptions",
    "availableItemTypeFilters",
    "headHTML",
    "customCSS"
];

function parseConfigSettings(config: ConfigurationSettings) {
    const all = {};
    let keys: string[] = (config as any).keys();
    keys = keys.concat(originalConfig);
    keys.forEach((key: string) => {
        all[key] = config.get(key);
    });

    // Verify all needed props are set correctly:
    all["compassWidget"] = 
        (config.get("compassPosition") !== undefined ? 
            config.get("compassPosition") : 
            all["compassWidget"]
        ); 
    all["homeWidget"] = 
        (config.get("homePosition") !== undefined ? 
            config.get("homePosition") : 
            all["homeWidget"]
        ); 
    all["legendWidget"] = 
        (config.get("legendPosition") !== undefined ? 
            config.get("legendPosition") : 
            all["legendWidget"]
        ); 
    all["locateWidget"] = 
        (config.get("locatePosition") !== undefined ? 
            config.get("locatePosition") : 
            all["locateWidget"]
        ); 
    all["searchWidget"] = 
        (config.get("searchPosition") !== undefined ? 
            config.get("searchPosition") : 
            all["searchWidget"]
        ); 
    all["basemapGalleryWidget"] = 
        (config.get("basemapGalleryPosition") !== undefined ? 
            config.get("basemapGalleryPosition") : 
            all["basemapGalleryWidget"]
        ); 

    return all;
}