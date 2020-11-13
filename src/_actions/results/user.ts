import { Pojo } from "../../Component";

export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
export const ADD_TO_FAVORITES_SUCCESS = "ADD_TO_FAVORITES_SUCCESS";
export const ADD_TO_FAVORITES_FAIL = "ADD_TO_FAVORITES_FAIL";
export const LOADING_USER_INFO = "LOADING_USER_INFO";
export const UPDATE_GROUP_CATEGORIES = "UPDATE_GROUP_CATEGORIES";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const UPDATE_USER_INFO_SUCCESS = "UPDATE_USER_INFO_SUCCESS";
export const UPDATE_USER_INFO_FAILED = "UPDATE_USER_INFO_FAILED";
export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";
export const REMOVE_FROM_FAVORITES_SUCCESS = "REMOVE_FROM_FAVORITES_SUCCESS";
export const REMOVE_FROM_FAVORITES_FAIL = "REMOVE_FROM_FAVORITES_FAIL";

export const addToFavorites = (item: Pojo) => ({ type: ADD_TO_FAVORITES, payload: item });
export const removeFromFavorites = (item: Pojo) => ({ type: REMOVE_FROM_FAVORITES, payload: item });
