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

export default (cfg: string, settings: Pojo) => {
    const config = JSON.parse(cfg);
    // Inject custom stylesheet if provided
    if (config.customCSS && config.customCSS.length > 0) {
        const customStyle = document.createElement("style");
        customStyle.innerHTML = config.customCSS;
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
                url: config.portalUrl,
                dialogTitle: config.title,
                resultsPerQuery: config.resultsPerQuery,
                allowedItemTypes: config.allowedItemTypes,
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
                    id: "dbc385ac1b7d4231b24b97750f0e633c"
                }
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
