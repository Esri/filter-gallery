import * as Portal from "esri/portal/Portal";
import * as Base from "./_applicationBase/ApplicationBase";

import {
    applyMiddleware,
    createStore,
    createProjector,
    createEpicMiddleware,
    H,
    Store,
    addListener,
    Pojo
} from "./Component";
import { rootEpic } from "./_epic";
import reducer, { initialState, FilterGalleryState } from "./_reducer";
import RootComponent from "./components/FilterGallery";
import { loadPortal } from "./_actions";
import { startHistoryListener, router } from "./router";

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (config: Pojo, settings: Pojo) => {
    // Inject custom stylesheet if provided
    if (initialState.settings.config.customCSS) {
        const customStyle = document.createElement("style");
        customStyle.innerHTML = initialState.settings.config.customCSS;
        document.body.appendChild(customStyle);
    }

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
            config: {
                ...initialState.settings.config,
                ...config
            },
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
};
