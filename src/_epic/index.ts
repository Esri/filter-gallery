import { Observable, Subject } from "rxjs";
import { filter, mapTo } from "rxjs/operators";
import { Action } from "../Component";
import { FilterGalleryState } from "../_reducer";

export const rootEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    filter((action) => action.type === "FOOBAR"),
    mapTo({ type: "FOOBAR!!!" })
);
