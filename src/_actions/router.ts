export const PUSH = "ROUTER/PUSH";
export const LOCATION_CHANGE = "ROUTER/LOCATION_CHANGE";
export const HASH_CHANGE = "ROUTER/HASH_CHANGE";

export const push = (hash: string | null) => ({
    type: PUSH,
    payload: hash,
});

export const hashChange = (hash: string) => ({
    type: HASH_CHANGE,
    payload: hash
});