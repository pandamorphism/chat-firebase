import {Injectable} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Chatroom} from '../model/chatroom';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {finalize, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  chatrooms$ = this.db.collection<Chatroom>('chatrooms').valueChanges();
  currentChatroom$: ReplaySubject<Chatroom> = new ReplaySubject(1);

  constructor(private db: AngularFirestore,
              private loadingService: LoadingService) {
  }

  getChatrooms(): Observable<Chatroom[]> {
    return of([{id: '1', name: 'Cat Facts'}, {id: '2', name: 'Dog Facts'}]);
  }

  changeChatroom(chatRoomId: any) {
    console.log('changing chatroom  to: %O', chatRoomId);
    if (!chatRoomId) {
      return;
    }
    this.loadingService.start();
    this.db.doc<Chatroom>(`chatrooms/${chatRoomId}`).valueChanges()
      .pipe(
        tap(chatroom => this.currentChatroom$.next(chatroom)),
        take(1),
        finalize(() => this.loadingService.stop())).subscribe();
  }
}
