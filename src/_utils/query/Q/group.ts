import { curry } from "../../functional/index";

/**
 * Returns new q including the group query based on a supplied group
 * @param group id of the group
 * @param q previous q
 */
export const appendGroupQ = curry((group: { id: string } | undefined, q: string[]): string[] => {
    if (!!group) {
        return [ ...q, `(group:${group.id})` ];
    }
    return q;
});