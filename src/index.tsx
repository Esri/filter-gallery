import * as i18n from "dojo/i18n!nls/resources";

import { applyMiddleware, createStore, createProjector, createEpicMiddleware, H, Store } from "./Component";
import { rootEpic } from "./_epic";
import reducer, { initialState, FilterGalleryState } from "./_reducer";
import RootComponent from "./components/FilterGallery";

export type FilterGalleryStore = Store<FilterGalleryState>;

export default (config: any) => {
    const node = document.getElementById("viewDiv") as HTMLElement;
    const store = applyMiddleware(createEpicMiddleware(rootEpic))(createStore)(reducer, initialState);
    createProjector(
        store,
        (tsx: H) => (<RootComponent key="root" />),
        node
    );
};
