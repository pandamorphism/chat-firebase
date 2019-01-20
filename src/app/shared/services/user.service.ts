import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import {LoadingService} from './loading.service';
import {finalize, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore,
              private loadingService: LoadingService) {
  }

  getById(id: string): Observable<User> {
    this.loadingService.start();
    return this.db.doc<User>(`users/${id}`).valueChanges().pipe(take(1), finalize(() => this.loadingService.stop()));
  }
}
