import { Action } from "../Component";

export interface FilterGalleryState {
    foo: string;
}

export const initialState = {
    foo: "bar"
};

export default (state: FilterGalleryState = initialState, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};
