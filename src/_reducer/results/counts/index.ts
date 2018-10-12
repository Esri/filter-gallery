import { combineReducers } from "../../../Component";
import access, { AccessState, initialState as accessInitial } from "./access";
import contentStatus, { ContentStatusState, initialState as contentStatusInitial } from "./status";

export interface CountsState {
    access: AccessState;
    contentStatus: ContentStatusState;
}
export const initialState: CountsState = {
    access: accessInitial,
    contentStatus: contentStatusInitial
};

export default combineReducers<CountsState>({
    access,
    contentStatus
});