import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

export const IS_TRUE: (x: boolean) => boolean = x => x === true;
export const NOT: (x: boolean) => boolean = x => !x;
export const IS_FALSE: (x: boolean) => boolean = x => NOT(IS_TRUE(x));
export const NOT_NULL: (x: any) => boolean = x => x !== undefined && x !== null;
export const NOT_EMPTY: (x: any[] | string) => boolean = x => NOT_NULL(x) && x.length > 0;

export const partition: <T>(predicate: (val: T) => boolean) => (source: Observable<T>) => Observable<T>[] =
  predicate => source =>
    [source.pipe(filter(predicate)), source.pipe(filter(x => !predicate(x)))];
