import { combineReducers } from "../../Component";

import config, { ConfigState, initialState as configInitial } from "./config";
import utils, { UtilsState, initialState as utilsInitial } from "./utils";

export interface SettingsState {
    config: ConfigState;
    utils: UtilsState;
}
export const initialState = {
    config: configInitial,
    utils: utilsInitial
};

export default combineReducers<SettingsState>({
    config,
    utils
});
