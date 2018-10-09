import { curry } from "../../functional/index";

/**
 * (Curried, arity 2) Returns new q including the access query based on a shared filter
 * 1. the value for the shared filter
 * 2. existing q to append access query to
 */
export const appendAccessQ = curry((shared: { value: string } | undefined, q: string[]): string[] => {
    if (!!shared) {
        return [ ...q, `(access:${shared.value})` ];
    }
    return q;
});