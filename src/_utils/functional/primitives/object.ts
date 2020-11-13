import { curry } from "../higherOrderFunctions";

/**
 * Returns true if the object in question is empty
 * @param input - object to determine if empty
 */
export function isEmpty(input: object) {
    return Object.keys(input).length === 0 && input.constructor === Object;
}

/**
 * (Curried, arity 2) Returns a shallow clone of an object with a property deleted
 * 1. name of the property to scrub
 * 2. object to scrub the property from
 */
export const scrubObjectProperty = curry((propertyName: string, obj: { [propName: string]: any }) => {
    const newObj = { ...obj };
    delete newObj[propertyName];
    return newObj;
});

/**
 * CURRIED: Takes a predicate function and an object, and returns the result of
 * applying the predicate to each of the object's properties as an object of the same shape.
 * @param fn - Predicate function to apply to each property
 * @param obj - Object to map
 */
export function mapObjIndexed<T, TResult>(
    fn: (value: T, key: string, obj?: { [key: string]: T }) => TResult,
    obj: { [key: string]: T }
): { [key: string]: TResult };
export function mapObjIndexed<T, TResult>(
    fn: (value: T, key: string, obj?: { [key: string]: T }) => TResult
): (obj: { [key: string]: T }) => { [key: string]: TResult };
export function mapObjIndexed(fn: any, obj?: any) {
    return curriedMapObjIndexed.apply(null, arguments);
}
const curriedMapObjIndexed = curry(<T, TResult>(
    fn: (value: T, key: string, obj?: { [key: string]: T }) => TResult,
    obj: { [key: string]: T }
): { [key: string]: TResult } => (
    Object.keys(obj).reduce(
        (acc: T, key: string) => {
            acc[key] = fn(obj[key], key, obj);
            return acc;
        },
        {}
    )
));

/**
 * CURRIED: Takes a predicate function and an object, and returns a partial copy of that object
 * containing only the properties which satisfy the provided predicate.
 * @param fn - Predicate function to test each property of the object
 * @param obj - Object to pick properties from
 */
export function pickBy<T, U>(fn: (value: any, key: string, obj?: T) => boolean): (obj: T) => U;
export function pickBy<T, U>(fn: (value: any, key: string, obj?: T) => boolean, obj?: T): U;
export function pickBy(fn: any, obj?: any): any {
    return curriedPickBy.apply(null, arguments);
}
const curriedPickBy = curry(<T, U>(fn: (value: any, key: string, obj?: T) => boolean, obj: T): U => (
    Object.keys(obj).reduce(
        (acc: U, key: string) => {
            if (fn(obj[key], key, obj)) {
                acc[key] = obj[key];
            }
            return acc;
        },
        {} as U
    )
));
