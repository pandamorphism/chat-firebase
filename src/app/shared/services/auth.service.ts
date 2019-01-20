import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';
import {merge, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {User} from '../model/user';
import {LoginModel, SignupModel} from '../model/view.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {mergeMap, switchMap, tap} from 'rxjs/operators';
import {separate} from 'rxjs-etc';
import {AngularFirestore} from '@angular/fire/firestore';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Subject<User | null> = new ReplaySubject(1);

  constructor(private router: Router,
              private alertService: AlertService,
              private fireAuth: AngularFireAuth,
              private db: AngularFirestore) {
    of(separate(this.fireAuth.authState, user => !!user))
      .pipe(mergeMap(([userExists$, userNotExists$]) =>
        merge(
          // when user exists pipeline
          userExists$.pipe(
            switchMap(user => this.db.doc<User>(`users/${user.uid}`).valueChanges().pipe(
              tap(userDetails => {
                this.currentUser$.next(userDetails);
              })
            ))
          ),
          // when user not exists pipeline
          userNotExists$.pipe(tap(_ => this.currentUser$.next(null)))
        )
      ))
      .subscribe();

  }

  signup({email, password, firstName, lastName}: SignupModel): Observable<boolean> {
    return fromPromise(this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
          const userUpdate = {
            uid: userCredentials.user.uid, firstName, lastName,
            quote: '',
            // tslint:disable-next-line
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/messaging-f9fff.appspot.com/o/default_profile_pic.jpg?alt=media&token=bd02001d-304e-40c1-bb9c-3d807fcac8fd'
          };
          this.db.doc<User>(`users/${userCredentials.user.uid}`).set(userUpdate);
          return true;
        }
      )
      .catch(err => {
        this.alertService.error('Error while signup user');
        return false;
      })
    );
  }

  login({email, password}: LoginModel): Observable<boolean> {
    return fromPromise(this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(_ => true));
  }

  logout() {
    this.fireAuth.auth.signOut()
      .then(_ => this.router.navigate(['/login']))
      .then(_ => this.alertService.success('You have been signed out.'));
  }
}
