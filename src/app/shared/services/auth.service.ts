import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {User} from '../model/user';
import {LoginModel, SignupModel} from '../model/view.model';
import {bob} from '../../pages/chat/components/chatroom-window/dummy-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Subject<User | null> = new ReplaySubject(1);
  genId: number;
  constructor(private router: Router,
              private alertService: AlertService) {
    // TODO fetch the user from the Firebase backend, then set the user
    this.currentUser$.next(null);
    this.genId = Date.now();
    console.log('created with %O', this.genId);
  }

  signup(model: SignupModel): Observable<boolean> {
    // TODO call Firebase signup function
    return of(true);
  }

  login(model: LoginModel): Observable<boolean> {
    // TODO call Firebase login function
    console.log('nexting %O', bob);
    this.currentUser$.next(bob);
    return of(true);
  }

  logout() {
    // TODO call Firebase logout
    this.router.navigate(['/login']);
    this.alertService.info('You have been signed out.');
  }
}
