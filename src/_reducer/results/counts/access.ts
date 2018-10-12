import { LOADING_CONTENT_SUCCESS } from "../../../_actions";
import { Action } from "../../../Component";

export interface AccessState {
    org: number | undefined;
    private: number | undefined;
    public: number | undefined;
    shared: number | undefined;
}
export const initialState: AccessState = {
    org: undefined,
    private: undefined,
    public: undefined,
    shared: undefined
};

export default (state: AccessState = initialState, action: Action): AccessState => {
    switch (action.type) {
        case LOADING_CONTENT_SUCCESS:
            if (
                action.payload.aggregations &&
                action.payload.aggregations.counts
            ) {
                const statusCounts = action.payload.aggregations.counts.filter(
                    (field: any) => field.fieldName === "access"
                )[0];
                if (statusCounts) {
                    const acctCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "account"
                    )[0];
                    const privateCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "private"
                    )[0];
                    const publicCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "public"
                    )[0];
                    const sharedCounts = statusCounts.fieldValues.filter(
                        (value: any) => value.value === "shared"
                    )[0];
                    return {
                        org: acctCounts ? acctCounts.count : undefined,
                        private: privateCounts ? privateCounts.count : undefined,
                        public: publicCounts ? publicCounts.count : undefined,
                        shared: sharedCounts ? sharedCounts.count : undefined,
                    };
                }
            }
            return state;
        default:
            return state;
    }
};
