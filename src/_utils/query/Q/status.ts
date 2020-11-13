import { curry } from "../../functional";
import { Pojo } from "../../../Component";

/**
 * (Curried, arity 2) Returns new q including the status query based on a status filter
 * 1. the value for the status filter
 * 2. existing q to append access query to
 */
export const appendStatusQ = curry((
    status: { value: string } | undefined,
    user: Pojo,
    q: string[]
): string[] => {
    if (!!status) {
        switch (status.value) {
            case "authoritative":
                if (user && user.orgId) {
                    return [
                        ...q,
                        `((contentstatus:org_authoritative orgid:${user.orgId}) OR contentstatus:public_authoritative)`
                    ];
                }
                return [ ...q, `(contentstatus:public_authoritative)` ];
            case "deprecated":
                return [ ...q, `(contentstatus:deprecated)` ];
            default:
                return q;
        }
    }
    return q;
});