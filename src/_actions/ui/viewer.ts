import { Pojo } from "../../Component";

export const VIEW_MAP = "VIEW_MAP";
export const VIEW_SCENE = "VIEW_SCENE";
export const VIEW_IN_MAP = "VIEW_IN_MAP";
export const VIEW_IN_SCENE = "VIEW_IN_SCENE";
export const CLOSE_VIEWER = "CLOSE_VIEWER";
export const CLOSE_VIEWER_IMMEDIATE = "CLOSE_VIEWER_IMMEDIATE";

export const viewMap = (item: Pojo) => ({ type: VIEW_MAP, payload: item });
export const viewScene = (item: Pojo) => ({ type: VIEW_SCENE, payload: item });
export const viewInMap = (item: Pojo) => ({ type: VIEW_IN_MAP, payload: item });
export const viewInScene = (item: Pojo) => ({ type: VIEW_IN_SCENE, payload: item });
export const closeViewer = () => ({ type: CLOSE_VIEWER });
export const closeViewerImmediate = () => ({ type: CLOSE_VIEWER_IMMEDIATE });
