import { combineEpics } from "../../Component";

import queryEpic from "./query";
import tagsEpic from "./tagsFilter";
import sectionEpic from "./section";
import userEpic from "./user";

export default combineEpics(
    queryEpic,
    sectionEpic,
    tagsEpic,
    userEpic
);