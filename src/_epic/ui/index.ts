import { combineEpics } from "../../Component";
import paginationEpic from "./pagination";
import viewerEpic from "./viewer";

export default combineEpics(
    paginationEpic,
    viewerEpic
);
