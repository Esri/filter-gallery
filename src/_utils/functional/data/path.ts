import { curry } from "../higherOrderFunctions";

/**
 * Joins the base and target path.
 * E.g. `joinPaths("./foo/bar", "../baz") === "./foo/baz" // true`
 * @param path1 - base path to join.
 * @param path2 - target path to join.
 */
export function joinPaths(path1: string, path2: string): string;
export function joinPaths(path1: string): (path2: string) => string;
export function joinPaths(path1: string, path2?: string) {
    return curriedJoinPaths.apply(null, arguments);
}
const curriedJoinPaths = curry((path1: string, path2: string) => 
    path2.split(/[\\\/]/).filter(notEmpty).reduce(
        (result: string[], current: string, i: number, arr: string[]) => {
            if (current === "..") {
                if (result[result.length - 1] !== "..") {
                    return result.slice(0, -1);
                }
                const targetBackups = arr.slice(i).filter((s: string) => s === "..");
                return result.length > targetBackups.length ?
                    result.concat(arr.slice(i).filter((s: string) => s !== "..")) :
                    arr.slice(i);
            }
            return result.concat([current]);
        },
        path1.split(/[\\\/]/).filter(notEmpty)
    ).join("/")
);

/**
 * Returns true if the provided string is not empty.
 * @param str - string to check if empty.
 */
export function notEmpty(str: string) {
    return str.length !== 0;
}