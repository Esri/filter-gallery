import { fetchFullItemDetails } from "../results/fetchFullItemDetails";
import { Pojo } from "../../Component";

export const CLOSING_DETAILS_PANE = "CLOSING_DETAILS_PANE";
export const CLOSE_DETAILS_PANE = "CLOSE_DETAILS_PANE";
export const VIEW_ITEM_DETAILS = "VIEW_ITEM_DETAILS";

export const closeDetailsPane = () => ({ type: CLOSING_DETAILS_PANE });

export const viewItemDetails = (item: Pojo) => (dispatch: any) => {
    dispatch({
        type: VIEW_ITEM_DETAILS,
        payload: item
    });
    
    dispatch(fetchFullItemDetails(item));
};
