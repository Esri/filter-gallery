export * from "./parameters/index";
export * from "./results/index";
export * from "./ui/index";

export const SIGNED_IN = "SIGNED_IN";
export const SIGN_IN = "SIGN_IN";
export const signIn = () => ({ type: SIGN_IN });

export const SIGNED_OUT = "SIGNED_OUT";
export const SIGN_OUT = "SIGN_OUT";
export const signOut = () => ({ type: SIGN_OUT });
