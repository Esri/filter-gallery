import { combineEpics } from "../Component";
import portalEpic from "./portal";
import resultsEpic from "./results";
import signInOutEpic from "./signInOut";
import uiEpic from "./ui";

export const rootEpic = combineEpics(
    portalEpic,
    resultsEpic,
    signInOutEpic,
    uiEpic,
);
