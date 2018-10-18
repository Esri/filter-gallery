import { Action, Pojo } from "../../Component";
import { VIEW_MAP, VIEW_SCENE, VIEW_IN_MAP, VIEW_IN_SCENE, CLOSE_VIEWER, CLOSE_VIEWER_IMMEDIATE } from "../../_actions";

export interface ViewerState {
    closing: boolean;
    open: boolean;
    item: Pojo;
    type: "map" | "scene" | "mapLayer" | "sceneLayer";
}

export const initialState: ViewerState = {
    closing: false,
    open: false,
    item: {},
    type: "map" as ViewerState["type"]
};

export default (state: ViewerState, action: Action) => {
    switch (action.type) {
        case VIEW_MAP:
            return {
                ...state,
                closing: false,
                open: true,
                item: action.payload,
                type: "map" as ViewerState["type"]
            };
        case VIEW_SCENE:
            return {
                ...state,
                closing: false,
                open: true,
                item: action.payload,
                type: "scene" as ViewerState["type"]
            };
        case VIEW_IN_MAP:
            return {
                ...state,
                closing: false,
                open: true,
                item: action.payload,
                type: "mapLayer" as ViewerState["type"]
            };
        case VIEW_IN_SCENE:
            return {
                ...state,
                closing: false,
                open: true,
                item: action.payload,
                type: "sceneLayer" as ViewerState["type"]
            };
        case CLOSE_VIEWER:
            return {
                ...state,
                closing: true,
            };
        case CLOSE_VIEWER_IMMEDIATE:
            return {
                ...state,
                closing: false,
                open: false
            };
        default:
            return state;
    }
};
