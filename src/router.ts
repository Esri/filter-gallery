import { PUSH, hashChange } from "./_actions";
import { Store } from "./Component";

export const router = () => (next: any) => (action: any) => {
    switch (action.type) {
        case PUSH:
            window.location.hash = action.payload;
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