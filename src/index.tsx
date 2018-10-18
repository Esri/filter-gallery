import * as Portal from "esri/portal/Portal";

import {
    applyMiddleware,
    createStore,
    createProjector,
    createEpicMiddleware,
    H,
    Store,
    addListener
} from "./Component";
import { rootEpic } from "./_epic";
import reducer, { initialState, FilterGalleryState } from "./_reducer";
import RootComponent from "./components/FilterGallery";
import { loadPortal } from "./_actions";
import { getOrgBaseUrl } from "./_utils";
import { startHistoryListener, router } from "./router";

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (config: any) => {
    const node = document.getElementById("viewDiv") as HTMLElement;
    const portal = new Portal({ url: "https://arcgis.com" });
    portal["baseUrl"] = getOrgBaseUrl(portal);
    const store: FilterGalleryStore = applyMiddleware(
        createEpicMiddleware(rootEpic),
        router,
        addListener((action, state) => console.log(action, state))
    )(createStore)(reducer, {
        ...initialState,
        settings: {
            ...initialState.settings,
            utils: {
                ...initialState.settings.utils,
                portal
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
