import { Subject, Observable } from "rxjs";
import { Action } from "../Component";
import { FilterGalleryState } from "../_reducer";
import { withLatestFrom, filter, map, tap } from "rxjs/operators";

export const loggerEpic = (action$: Subject<Action>, state$: Observable<FilterGalleryState>) => action$.pipe(
    withLatestFrom(state$),
    tap(([ action, state ]) => console.log(action, state)),
    filter(() => false),
    map(([ action ]) => action)
);