import { Pojo, Action } from "../../Component";

export const LOADED_ITEM = "LOADED_ITEM";
export const loadedItem = (item: Pojo, viewType: string): Action =>
    ({ type: LOADED_ITEM, payload: { item, viewType } });

export const LOAD_ITEM_FAILED = "LOAD_ITEM_FAILED";
