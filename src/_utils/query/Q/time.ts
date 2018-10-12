import { curry } from "../../functional";

const appendTimeRangeQ = curry((
    type: string,
    range: { start: number, end: number } | undefined,
    q: string[]
): string[] => {
    if (range) {
        return [...q, `(${type}:${formatDateRange(range)})`];
    }
    return q;
});

/**
 * (Curried, arity 2) Returns new q including the date modified query based on a time range
 * 1. time range with start and end equal to ms since the epoch
 * 2. previous q
 */
export const appendDateModifiedQ = appendTimeRangeQ("modified");

/**
 * (Curried, arity 2) Returns new q including the date created query based on a time range
 * 1. time range with start and end equal to ms since the epoch
 * 2. previous q
 */
export const appendDateCreatedQ = appendTimeRangeQ("uploaded");

/**
 * Returns a time range as string formatted for the sharing API
 * @param date Object with 'start' and 'end' indicating milliseconds elapsed since January 1, 1970 00:00:00 UTC
 */
function formatDateRange(range: { start: number, end: number }): string {
    return `[000000${range.start} TO 000000${range.end}]`;
}
