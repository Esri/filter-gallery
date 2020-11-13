/**
 * Yields a new function which is the curried form of the input function.
 * Curried functions can be partially applied with any number of arguments less than their arity to yield
 * a new curried function accepting the remaining arguments.
 */
export interface CurriedTypeGuard2<T1, T2, R extends T2> {
    (t1: T1): (t2: T2) => t2 is R;
    (t1: T1, t2: T2): t2 is R;
}
export interface CurriedTypeGuard3<T1, T2, T3, R extends T3> {
    (t1: T1): CurriedTypeGuard2<T2, T3, R>;
    (t1: T1, t2: T2): (t3: T3) => t3 is R;
    (t1: T1, t2: T2, t3: T3): t3 is R;
}
export interface CurriedTypeGuard4<T1, T2, T3, T4, R extends T4> {
    (t1: T1): CurriedTypeGuard3<T2, T3, T4, R>;
    (t1: T1, t2: T2): CurriedTypeGuard2<T3, T4, R>;
    (t1: T1, t2: T2, t3: T3): (t4: T4) => t4 is R;
    (t1: T1, t2: T2, t3: T3, t4: T4): t4 is R;
}
export interface CurriedTypeGuard5<T1, T2, T3, T4, T5, R extends T5> {
    (t1: T1): CurriedTypeGuard4<T2, T3, T4, T5, R>;
    (t1: T1, t2: T2): CurriedTypeGuard3<T3, T4, T5, R>;
    (t1: T1, t2: T2, t3: T3): CurriedTypeGuard2<T4, T5, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): (t5: T5) => t5 is R;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): t5 is R;
}
export interface CurriedTypeGuard6<T1, T2, T3, T4, T5, T6, R extends T6> {
    (t1: T1): CurriedTypeGuard5<T2, T3, T4, T5, T6, R>;
    (t1: T1, t2: T2): CurriedTypeGuard4<T3, T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3): CurriedTypeGuard3<T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): CurriedTypeGuard2<T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): (t6: T6) => t6 is R;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): t6 is R;
}
export interface CurriedFunction2<T1, T2, R> {
    (t1: T1): (t2: T2) => R;
    (t1: T1, t2: T2): R;
}
export interface CurriedFunction3<T1, T2, T3, R> {
    (t1: T1): CurriedFunction2<T2, T3, R>;
    (t1: T1, t2: T2): (t3: T3) => R;
    (t1: T1, t2: T2, t3: T3): R;
}
export interface CurriedFunction4<T1, T2, T3, T4, R> {
    (t1: T1): CurriedFunction3<T2, T3, T4, R>;
    (t1: T1, t2: T2): CurriedFunction2<T3, T4, R>;
    (t1: T1, t2: T2, t3: T3): (t4: T4) => R;
    (t1: T1, t2: T2, t3: T3, t4: T4): R;
}
export interface CurriedFunction5<T1, T2, T3, T4, T5, R> {
    (t1: T1): CurriedFunction4<T2, T3, T4, T5, R>;
    (t1: T1, t2: T2): CurriedFunction3<T3, T4, T5, R>;
    (t1: T1, t2: T2, t3: T3): CurriedFunction2<T4, T5, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): (t5: T5) => R;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}
export interface CurriedFunction6<T1, T2, T3, T4, T5, T6, R> {
    (t1: T1): CurriedFunction5<T2, T3, T4, T5, T6, R>;
    (t1: T1, t2: T2): CurriedFunction4<T3, T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3): CurriedFunction3<T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): CurriedFunction2<T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): (t6: T6) => R;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): R;
}
export function curry<T1, T2, TResult extends T2>(
    fn: (a: T1, b: T2) => b is TResult
): CurriedTypeGuard2<T1, T2, TResult>;
export function curry<T1, T2, T3, TResult extends T3>(
    fn: (a: T1, b: T2, c: T3) => c is TResult
): CurriedTypeGuard3<T1, T2, T3, TResult>;
export function curry<T1, T2, T3, T4, TResult extends T4>(
    fn: (a: T1, b: T2, c: T3, d: T4) => d is TResult
): CurriedTypeGuard4<T1, T2, T3, T4, TResult>;
export function curry<T1, T2, T3, T4, T5, TResult extends T5>(
    fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => e is TResult
): CurriedTypeGuard5<T1, T2, T3, T4, T5, TResult>;
export function curry<T1, T2, T3, T4, T5, T6, TResult extends T6>(
    fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => f is TResult
): CurriedTypeGuard6<T1, T2, T3, T4, T5, T6, TResult>;
export function curry<T1, T2, TResult>(
    fn: (a: T1, b: T2) => TResult
): CurriedFunction2<T1, T2, TResult>;
export function curry<T1, T2, T3, TResult>(
    fn: (a: T1, b: T2, c: T3) => TResult
): CurriedFunction3<T1, T2, T3, TResult>;
export function curry<T1, T2, T3, T4, TResult>(
    fn: (a: T1, b: T2, c: T3, d: T4) => TResult
): CurriedFunction4<T1, T2, T3, T4, TResult>;
export function curry<T1, T2, T3, T4, T5, TResult>(
    fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => TResult
): CurriedFunction5<T1, T2, T3, T4, T5, TResult>;
export function curry<T1, T2, T3, T4, T5, T6, TResult>(
    fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => TResult
): CurriedFunction6<T1, T2, T3, T4, T5, T6, TResult>;
export function curry(
    fn: (...args: any[]) => any
) {
    return function curried(this: any, ...args: any[]) {
        return args.length >= fn.length ?
            fn.call(this, ...args) :
            (...rest: any[]) => {
                return curried.call(this, ...args, ...rest);
            };
    };
}
