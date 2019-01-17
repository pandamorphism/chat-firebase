import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {merge, Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AlertService} from '../services/alert.service';
import {mapTo, mergeMap, take, tap} from 'rxjs/operators';
import {partition} from '../misc/pure.utils';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authInfo: Observable<User>[];

  constructor(private auth: AuthService,
              private router: Router,
              private alertService: AlertService) {
    this.authInfo = partition<User>(user => !!user)(this.auth.currentUser$);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.auth.currentUser$
      .pipe(take(1))
      .subscribe();
    return of(this.authInfo).pipe(
      mergeMap(([isAuthenticated$, notAuthenticated$]) => merge(
        isAuthenticated$.pipe(mapTo(true)),
        notAuthenticated$.pipe(
          mapTo(false),
          tap(_ => this.alertService.error('Can`t access this route')),
          tap(_ => this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})))
        ).pipe(take(1))
      ),
    );
  }
}
