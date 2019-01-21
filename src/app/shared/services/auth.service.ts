import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from './alert.service';
import {merge, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {User} from '../model/user';
import {LoginModel, SignupModel} from '../model/view.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import {separate} from 'rxjs-etc';
import {AngularFirestore} from '@angular/fire/firestore';
import {fromPromise} from 'rxjs/internal-compatibility';
import {LoadingService} from './loading.service';
import {tag} from 'rxjs-spy/operators';
import {NOT_EMPTY} from '../misc/pure.utils';
import {ChatroomService} from './chatroom.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Subject<User | null> = new ReplaySubject(1);

  constructor(private router: Router,
              private alertService: AlertService,
              private fireAuth: AngularFireAuth,
              private loadingService: LoadingService,
              private chatroomService: ChatroomService,
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

  signup({email, password, firstName, lastName}: SignupModel): Observable<void> {
    this.loadingService.start();
    return fromPromise(this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
          const userUpdate = {
            uid: userCredentials.user.uid, firstName, lastName,
            quote: '',
            // tslint:disable-next-line
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/messaging-f9fff.appspot.com/o/default_profile_pic.jpg?alt=media&token=bd02001d-304e-40c1-bb9c-3d807fcac8fd'
          };
          this.db.doc<User>(`users/${userCredentials.user.uid}`).set(userUpdate)
            .then(_ =>
              // assign newly created user to default channel
              this.chatroomService.getDefaultChatrooms$()
                .pipe(
                  take(1),
                  tap(rooms => console.log('roomsD: %O', rooms)),
                  filter(NOT_EMPTY),
                  map(rooms => rooms[0]),
                  switchMap(room => this.chatroomService.addToChatroom(room.id, userUpdate)),
                  tag('defaultRoom')
                ).subscribe());
        }
      )
      .catch(err => {
        this.alertService.error('Error while signup user');
      })
      .finally(() => this.loadingService.stop())
    );
  }

  login({email, password}: LoginModel): Observable<boolean> {
    this.loadingService.start();
    return fromPromise(this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(_ => true)
      .finally(() => this.loadingService.stop()));
  }

  logout() {
    this.fireAuth.auth.signOut()
      .then(_ => this.router.navigate(['/login']))
      .then(_ => this.alertService.success('You have been signed out.'));
  }
}
