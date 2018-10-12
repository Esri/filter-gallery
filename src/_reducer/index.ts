import { combineReducers } from "../Component";

import settings, { SettingsState, initialState as settingsInitial } from "./settings/index";
import parameters, { ParametersState, initialState as parametersInitial } from "./parameters/index";
import results, { ResultsState, initialState as resultsInitial } from "./results/index";
import ui, { UIState, initialState as uiInitial } from "./ui/index";
export const defaultConfig: SettingsState["config"] = settingsInitial.config;

export interface FilterGalleryState {
    settings: SettingsState;
    parameters: ParametersState;
    results: ResultsState;
    ui: UIState;
}

export const initialState: FilterGalleryState = {
    parameters: parametersInitial,
    settings: settingsInitial,
    results: resultsInitial,
    ui: uiInitial
};

export default combineReducers<FilterGalleryState>({
    settings,
    parameters,
    results,
    ui
});
