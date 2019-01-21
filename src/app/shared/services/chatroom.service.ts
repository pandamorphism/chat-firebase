import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Chatroom} from '../model/chatroom';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {filter, finalize, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {Message} from '../model/message';
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
  private defaultChatrooms$: Observable<Chatroom[]>;

  constructor(private db: AngularFirestore,
              private loadingService: LoadingService) {
    this.currentChatroom$.pipe(
      filter(NOT_NULL),
      switchMap(chatroom =>
        this.db.collection<Message>(`chatrooms/${chatroom.id}/messages`,
          ref => ref.orderBy('createAt', 'desc').limit(15))
          .valueChanges()
      ),
      tap(messages => this.currentMessages$.next(messages.reverse())),
      tag('messages')
    ).subscribe();
    this.defaultChatrooms$ = this.db.collection<Chatroom>('chatrooms', ref => ref.where('isDefault', '==', true))
      .valueChanges().pipe(shareReplay(1));
  }

  getChatroomsByUserId(userId: string): Observable<Chatroom[]> {
    return this.defaultChatrooms$ = this.db.collection<Chatroom>('chatrooms', ref => ref.where(`participants.${userId}`, '==', true))
      .valueChanges().pipe(tap(rooms => console.log('rooms for %O are: %O', userId, rooms)), shareReplay(1));
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
        take(1),
        finalize(() => this.loadingService.stop()),
      ).subscribe();
  }

  createMessage(message: string, user: User) {
    this.currentChatroom$
      .pipe(
        map(chatRoom => toMessageForChatroom(chatRoom, user, message)),
        tap(({chatroom, msg}) => this.db.collection(`chatrooms/${chatroom.id}/messages`).add(msg)),
        take(1),
        tag('createMessage')
      )
      .subscribe();
  }

  getDefaultChatrooms$(): Observable<Chatroom[]> {
    return this.defaultChatrooms$;
  }

}
