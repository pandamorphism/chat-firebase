import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubj$: Subject<boolean> = new Subject();
  loading$: Observable<boolean> = this.loadingSubj$.asObservable();

  constructor() {
  }

  start() {
    this.loadingSubj$.next(true);
  }

  stop() {
    this.loadingSubj$.next(false);
  }
}
