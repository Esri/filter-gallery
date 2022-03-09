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
import { loadPortal, OriginError, loadPortalThenUpdateSection } from "./_actions";
import { startHistoryListener, router } from "./router";

import ApplicationBaseGallery from "./ApplicationBaseGallery";

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (cfg: string, sets: string) => {
    const config = JSON.parse(cfg);
    const settings = JSON.parse(sets);
    
    // Load the application base
    const base = new ApplicationBaseGallery({ config, settings });
    
    const node = document.getElementById("viewDiv") as HTMLElement;
    let store: FilterGalleryStore;
    let projector: Projector;

    const startProjector = () => {
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
    };

    const errorHandler = (err: Error | OriginError) => {
        console.error("Error: ", err);
        if  ((err as OriginError).error === "application:origin-other") {
            err = err as OriginError;
            document.location.href = `../../shared/origin/index.html?appUrl=${err?.appUrl}`; 
        } else {
            // create store and projector in order for app to display error
            startProjector();
        }  
    };

    base.load().then(
        () => {
            base.portal.load().then(
                () => {
                    base.loadConfig().then((config) => { 
                        document.title = config.title;
                        if (!config.group) { //group is not set
                            document.location.href = `../../shared/unavailable/index.html?appid=${
                                config?.appid || null
                              }`;
                        }
                        startProjector();
                    });
                }, 
                errorHandler
            );
        }, 
        errorHandler
    );
    
    window.addEventListener(
        "message",
        ((e: MessageEvent) => {
            if (e?.data?.type === "rerender") {
                base.loadConfig().then(() => {
                    if (projector !== undefined) {
                        //handle custom updates
                        if (e?.data?.properties.hasOwnProperty("useOrgCategories")) {
                            store.dispatch(loadPortalThenUpdateSection());
                        } else {
                            store.dispatch(loadPortal());
                            // projector.scheduleRender();
                        }
                    }
                });
                
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