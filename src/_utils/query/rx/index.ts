import { AsyncSubject } from "rxjs";

export function fromDeferred<T>(dfd: dojo.Deferred<T>): AsyncSubject<T> {
    const subject = new AsyncSubject<T>();
    dfd.then(
        (value: T) => {
            subject.next(value);
            subject.complete();
        },
        (err) => {
            subject.error(err);
        }
    );
    return subject;
}