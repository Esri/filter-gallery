/**
 * Passes data to some void function as it flows through a pipeline, for example log current with tap(console.log)
 * @param fn - function which performs side effects
 * @param value - data flowing through pipeline
 */
export function tap<T>(fn: (a: T) => any, value: T): T;
export function tap<T>(fn: (a: T) => any): (value: T) => T;
export function tap(fn: (a: any) => any) {
    return (b: any) => {
        fn(b);
        return b;
    };
}

/**
 * Logs data as it passes through a pipeline
 * @param value - data flowing through pipeline
 */
export const log = tap(console.log);