import { FilterGalleryState } from "../../_reducer";
import { scrubItemInfo } from "../../_utils/index";
import { Pojo } from "../../Component";

export const START_CUSTOM_ACTION = "START_CUSTOM_ACTION";
export const END_CUSTOM_ACTION = "END_CUSTOM_ACTION";

type CustomAction = FilterGalleryState["settings"]["config"]["customActions"][number];

export const customAction = (actionName: string, item: Pojo) => (dispatch: any, getState: () => FilterGalleryState) => {
    const state = getState();
    const action = state.settings.config.customActions.filter((customAction: CustomAction) => {
        return customAction.name === actionName;
    })[0];
    if (action) {
        if (action.asynchronous) {
            dispatch({ type: START_CUSTOM_ACTION, payload: item });
            action.onAction(scrubItemInfo(item)).then(() => {
                dispatch({ type: END_CUSTOM_ACTION, payload: item });
            }, () => {
                dispatch({ type: END_CUSTOM_ACTION, payload: item });
            });
        } else {
            action.onAction(scrubItemInfo(item));
        }
    }
};
