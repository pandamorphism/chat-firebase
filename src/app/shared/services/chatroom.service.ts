import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Chatroom} from '../model/chatroom';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {filter, finalize, map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {Message} from '../model/message';
import {AuthService} from './auth.service';
import {User} from '../model/user';
import {NOT_NULL} from '../misc/pure.utils';
import {tag} from 'rxjs-spy/operators';

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

  chatrooms$ = this.db.collection<Chatroom>('chatrooms').valueChanges().pipe(tag('chatrooms'));
  currentChatroom$: ReplaySubject<Chatroom> = new ReplaySubject(1);
  currentMessages$: ReplaySubject<Message[]> = new ReplaySubject(1);

  constructor(private db: AngularFirestore,
              private auth: AuthService,
              private loadingService: LoadingService) {
    this.currentChatroom$.pipe(
      filter(NOT_NULL),
      switchMap(chatroom =>
        this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`,
          ref => ref.orderBy('createAt', 'asc')).valueChanges()),
      tap(messages => this.currentMessages$.next(messages)),
    ).subscribe();
  }

  /**
   *
   * @param chatRoomId
   * switches chatroom to room with given id, and nexting messages for that room
   */
  switchChatroom(chatRoomId: any) {
    if (!chatRoomId) {
      this.currentChatroom$.next(null);
      return;
    }
    this.loadingService.start();
    this.db.doc<Chatroom>(`chatrooms/${chatRoomId}`).valueChanges()
      .pipe(
        tap(chatroom => this.currentChatroom$.next(chatroom)),
        switchMap(chatroom => this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`)
          .valueChanges().pipe(map(messages =>
            messages.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())))
        ),
        take(1),
        finalize(() => this.loadingService.stop()),
        tag('messages')
      ).subscribe();
  }

  createMessage(message: string) {
    this.currentChatroom$
      .pipe(
        withLatestFrom(this.auth.currentUser$),
        map(([chatRoom, user]) => toMessageForChatroom(chatRoom, user, message)),
        tap(({chatroom, msg}) => this.db.collection(`chatrooms/${chatroom.id}/messages`).add(msg)),
        take(1),
        tag('createMessage')
      )
      .subscribe();
  }

}
