import { combineEpics } from "../Component";
import portalEpic from "./portal";
import resultsEpic from "./results";
import signInOutEpic from "./signInOut";
import uiEpic from "./ui";
import routerEpic from "./router";

export const rootEpic = combineEpics(
    portalEpic,
    resultsEpic,
    signInOutEpic,
    uiEpic,
    routerEpic
);
