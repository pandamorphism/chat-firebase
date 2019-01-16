import {Injectable} from '@angular/core';
import {Alert} from '../model/alert';
import {Observable, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubj$: Subject<Alert> = new Subject();
  alerts$: Observable<Alert> = this.alertsSubj$.asObservable();

  constructor(private snackBar: MatSnackBar) {
    this.alerts$.pipe(
      tap(alert => this.snackBar.open(alert.text, '', {
        duration: 2000,
        panelClass: alert.type,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }))
    )
      .subscribe();
  }

  error(message: string) {
    this.alertsSubj$.next({text: message, type: 'danger'});
  }

  info(message: string) {
    this.alertsSubj$.next({text: message, type: 'info'});
  }

  success(message: string) {
    this.alertsSubj$.next({text: message, type: 'success'});
  }
}
