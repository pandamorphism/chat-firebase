import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Chatroom} from '../model/chatroom';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {finalize, map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {Message} from '../model/message';
import {AuthService} from './auth.service';
import {User} from '../model/user';

export type MessageToChatroom = {
  chatroom: Chatroom,
  msg: Message
};
const toMessageForChatroom: (chatroom: Chatroom, user: User, message: string) => MessageToChatroom =
  (chatroom, user, message) => ({
    chatroom, msg: {
      createAt: new Date(),
      message, sender: user
    }
  });

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  chatrooms$ = this.db.collection<Chatroom>('chatrooms').valueChanges();
  currentChatroom$: ReplaySubject<Chatroom> = new ReplaySubject(1);
  currentMessages$: ReplaySubject<Message[]> = new ReplaySubject(1);
  messsagesLive$: Observable<Message[]>;

  constructor(private db: AngularFirestore,
              private auth: AuthService,
              private loadingService: LoadingService) {
    this.currentChatroom$.pipe(
      switchMap(chatroom =>
        this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`,
          ref => ref.orderBy('createAt', 'asc')).valueChanges()),
      tap(messages => this.currentMessages$.next(messages))
    ).subscribe();
  }


  changeChatroom(chatRoomId: any) {
    if (!chatRoomId) {
      return;
    }
    this.loadingService.start();
    this.db.doc<Chatroom>(`chatrooms/${chatRoomId}`).valueChanges()
      .pipe(
        tap(chatroom => this.currentChatroom$.next(chatroom)),
        switchMap(chatroom => this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`,
          /*ref => ref.orderBy('createdAt', 'desc')*/)
          .valueChanges().pipe(map(messages =>
            messages.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())))
        ),
        take(1),
        finalize(() => this.loadingService.stop()),
      ).subscribe();
  }

  createMessage(message: string) {
    this.currentChatroom$
      .pipe(
        withLatestFrom(this.auth.currentUser$),
        map(([chatRoom, user]) => toMessageForChatroom(chatRoom, user, message)),
        tap(({chatroom, msg}) => this.db.collection(`chatrooms/${chatroom.id}/messages`).add(msg)),
        take(1)
      )
      .subscribe();
  }

}
