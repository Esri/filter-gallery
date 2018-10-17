import { combineEpics } from "../Component";
import resultsEpic from "./results";
import signInOutEpic from "./signInOut";
import uiEpic from "./ui";

export const rootEpic = combineEpics(
    resultsEpic,
    signInOutEpic,
    uiEpic,
);
