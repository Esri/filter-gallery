import { PUSH, hashChange } from "./_actions";
import { Store } from "./Component";

export const router = () => (next: any) => (action: any) => {
    switch (action.type) {
        case PUSH:
            if (action.payload) {
                window.location.hash = action.payload;
            } else {
                // push dummy hash to avoid scroll, then remove
                window.location.hash = "__";
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }
            break;
        default:
            return next(action);
    }
};

export function startHistoryListener(store: Store<any>) {
    store.dispatch(hashChange(window.location.hash.slice(1)));

    window.onhashchange = () => {
        store.dispatch(hashChange(window.location.hash.slice(1)));
    };
}