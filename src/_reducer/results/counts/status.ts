import { LOADING_CONTENT_SUCCESS } from "../../../_actions";
import { Action } from "../../../Component";

export interface ContentStatusState {
    publicAuthoritative: number;
    orgAuthoritative: number;
    deprecated: number;
}
export const initialState: ContentStatusState = {
    publicAuthoritative: 0,
    orgAuthoritative: 0,
    deprecated: 0
};

export default (state: ContentStatusState = initialState, action: Action): ContentStatusState => {
    switch (action.type) {
        case LOADING_CONTENT_SUCCESS:
            if (
                action.payload.aggregations &&
                action.payload.aggregations.counts
            ) {
                const statusCounts = action.payload.aggregations.counts.filter(
                    (field: any) => field.fieldName === "contentstatus"
                )[0];
                if (statusCounts) {
                    const orgAuthCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "org_authoritative"
                    )[0];
                    const publicAuthCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "public_authoritative"
                    )[0];
                    const depCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "deprecated"
                    )[0];

                    return {
                        publicAuthoritative: publicAuthCounts ? publicAuthCounts.count : 0,
                        orgAuthoritative: orgAuthCounts ? orgAuthCounts.count : 0,
                        deprecated: depCounts ? depCounts.count : 0
                    };
                }
            }
            return state;
        default:
            return state;
    }
};
