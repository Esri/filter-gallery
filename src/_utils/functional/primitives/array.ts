import { curry } from "../higherOrderFunctions/index";

/**
 * removeDups function to use with filter (quadratic, use only in short arrays!)
 * @param el element
 * @param index index
 * @param arr array
 */
export const removeDups = (el: any, index: number, arr: any[]) => arr.indexOf(el) === index;

/**
 * (Curried, arity 2) Removes duplicates from an array of objects on a specified key
 * 1. key - index signature for key on which to remove dups
 * 2. input - array of items to remove dups from
 */
export const removeDupsOnKey = curry((key: string, input: any[]): any[] => {
    let seen = {};
    return input.filter((el: any) => {
        if (!seen[el[key]]) {
            seen[el[key]] = true;
            return true;
        }
        return false;
    });
});

/**
 * Filter empty strings out of an array
 * @param input - array of strings to filter
 */
export function filterEmptyStrings(input: string[]): string[] {
    return input.filter((item: string) => item.length > 0);
}
