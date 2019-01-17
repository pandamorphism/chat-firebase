import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubj$: Subject<boolean> = new Subject();
  private counter = 0;
  loading$: Observable<boolean> = this.loadingSubj$.asObservable();

  constructor() {
  }

  start() {
    if (this.counter === 0) {
      setTimeout(() => this.loadingSubj$.next(true));
    }
    console.log('INC');
    this.counter++;
  }

  stop() {
    if (this.counter > 0) {
      setTimeout(() => this.loadingSubj$.next(false));
    }
    console.log('DEC');
    this.counter--;
  }
}
