// import Base from "./_applicationBase/ApplicationBase";
import ApplicationBase = require("@esri/application-base-js");

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

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (cfg: string, sets: string) => {
    let config = JSON.parse(cfg);
    let settings = JSON.parse(sets);
    
    // Load the application base
    const base = new ApplicationBase({ config, settings });
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