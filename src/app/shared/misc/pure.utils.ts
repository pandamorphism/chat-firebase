import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export const IS_TRUE: (x: boolean) => boolean = x => x === true;
export const NOT: (x: boolean) => boolean = x => !x;
export const IS_FALSE: (x: boolean) => boolean = x => NOT(IS_TRUE(x));


export const partition: <T>(predicate: (val: T) => boolean) => (source: Observable<T>) => Observable<T>[] =
  predicate => source =>
    [source.pipe(filter(predicate)), source.pipe(filter(x => !predicate(x)))];
