import { combineEpics } from "../Component";
import queryEpic from "./results/query";
import { sectionEpic } from "./results/section";
import signInOutEpic from "./signInOut";
import tagsFilterEpic from "./results/tagsFilter";
import { paginationEpic } from "./ui/pagination";
import { userEpic } from "./results/user";

export const rootEpic = combineEpics(
    queryEpic,
    sectionEpic,
    userEpic,
    signInOutEpic,
    tagsFilterEpic,
    paginationEpic,
);
