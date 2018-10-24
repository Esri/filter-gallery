export * from "./parameters/index";
export * from "./results/index";
export * from "./ui/index";
export * from "./router";

export const SIGNED_IN = "SIGNED_IN";
export const SIGN_IN_FAILED = "SIGN_IN_FAILED";
export const SIGN_IN = "SIGN_IN";
export const signIn = () => ({ type: SIGN_IN });

export const SIGNED_OUT = "SIGNED_OUT";
export const SIGN_OUT_FAILED = "SIGN_OUT_FAILED";
export const SIGN_OUT = "SIGN_OUT";
export const signOut = () => ({ type: SIGN_OUT });

export const LOAD_PORTAL = "LOAD_PORTAL";
export const LOAD_PORTAL_SUCCESS = "LOAD_PORTAL_SUCCESS";
export const LOAD_PORTAL_FAILED = "LOAD_PORTAL_FAILED";
export const AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED";
export const loadPortal = () => ({ type: LOAD_PORTAL });