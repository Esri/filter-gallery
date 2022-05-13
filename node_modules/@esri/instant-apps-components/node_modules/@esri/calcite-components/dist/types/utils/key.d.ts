/**
 * Standardize key property of keyboard event (mostly for ie11)
 */
export declare function getKey(key: string, dir?: "rtl" | "ltr"): string;
export declare function isActivationKey(key: string): boolean;
export declare const numberKeys: string[];
export declare const letterKeys: string[];
