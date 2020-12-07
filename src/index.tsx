// import Base from "./_applicationBase/ApplicationBase";
import ApplicationBase = require("@esri/application-base-js");

import {
    applyMiddleware,
    createStore,
    createProjector,
    Projector,
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

import ApplicationBaseGallery from "./ApplicationBaseGallery";
import { ApplicationConfig } from 'ApplicationBase/interfaces';

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (cfg: string, sets: string) => {
    const config = JSON.parse(cfg);
    const settings = JSON.parse(sets);
    
    // Load the application base
    const base = new ApplicationBaseGallery({ config, settings });
    
    const node = document.getElementById("viewDiv") as HTMLElement;
    let store: FilterGalleryStore;
    let projector: Projector;
    base.load().then(() => {
        base.portal.load().then(() => {
            base.loadConfig().then(() => { 
                let config = base.config as ApplicationConfig;

                store = applyMiddleware(
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
                projector = createProjector(
                    store,
                    (tsx: H) => (<RootComponent key="root" />),
                    node
                );
            });
        });
    });
    
    window.addEventListener(
        "message",
        ((e: MessageEvent) => {
            if (e?.data?.type === "rerender") {
                base.loadConfig();
                if (projector !== undefined) {
                    store.dispatch(loadPortal());
                    // projector.scheduleRender();
                }
            }
        })
    );

    // const portal = new Portal({ url: "https://devext.arcgis.com" });
    // // const container = document.querySelector("#myDomNode");
    // const myItemBrowser = new ItemBrowserWrapper(node, {
    //     apiVersion: 4,
    //     portal,
    //     request});
};