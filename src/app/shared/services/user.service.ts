import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) {
  }

  getById(id: string): Observable<User> {
    return this.db.doc<User >(`users/${id}`).valueChanges();
  }
}
