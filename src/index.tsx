import * as i18n from "dojo/i18n!nls/resources";
import * as Portal from "esri/portal/Portal";

import {
    applyMiddleware,
    createStore,
    createProjector,
    createEpicMiddleware,
    H,
    Store,
    ThunkDispatch,
    thunk,
    addListener
} from "./Component";
import { rootEpic } from "./_epic";
import reducer, { initialState, FilterGalleryState } from "./_reducer";
import RootComponent from "./components/FilterGallery";
import { search } from "./_actions";

export type FilterGalleryStore = Store<FilterGalleryState> & { dispatch: ThunkDispatch<FilterGalleryState> };

export default (config: any) => {
    const node = document.getElementById("viewDiv") as HTMLElement;
    var portal = new Portal({ url: "https://arcgis.com" });
    portal.load().then(function(result) {
        const store: FilterGalleryStore = applyMiddleware(
            createEpicMiddleware(rootEpic),
            thunk,
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
        store.dispatch(search(true));
        createProjector(
            store,
            (tsx: H) => (<RootComponent key="root" />),
            node
        );
    });
};
