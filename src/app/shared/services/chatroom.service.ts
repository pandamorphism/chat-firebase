import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Chatroom} from '../model/chatroom';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {finalize, switchMap, take, tap} from 'rxjs/operators';
import {Message} from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  chatrooms$ = this.db.collection<Chatroom>('chatrooms').valueChanges();
  currentChatroom$: ReplaySubject<Chatroom> = new ReplaySubject(1);
  currentMessages$: ReplaySubject<Message[]> = new ReplaySubject(1);

  constructor(private db: AngularFirestore,
              private loadingService: LoadingService) {
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
        switchMap(chatroom => this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`).valueChanges()),
        tap(messages => this.currentMessages$.next(messages)),
        take(1),
        finalize(() => this.loadingService.stop())
      ).subscribe();
  }
}
