import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Chatroom, NewChatroom} from '../model/chatroom';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {LoadingService} from './loading.service';
import {filter, finalize, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {Message} from '../model/message';
import {User} from '../model/user';
import {NOT_NULL} from '../misc/pure.utils';
import {tag} from 'rxjs-spy/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

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
  currentChatroom$: ReplaySubject<Chatroom> = new ReplaySubject(1);
  currentMessages$: ReplaySubject<Message[]> = new ReplaySubject(1);
  private defaultChatrooms$: Observable<Chatroom[]>;

  // private userChatrooms$: Observable<Chatroom[]>;

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
      .valueChanges().pipe(tap(rooms => console.log('DEFAUULT: %O', rooms)), shareReplay(1), tag('defaultChatroomsSource'));
  }

  /**
   *
   * @param userId
   * return list of chatrooms whre current userId is participant
   */
  getChatroomsByUserId(userId: string): Observable<Chatroom[]> {
    return this.db.collection<Chatroom>('chatrooms', ref => ref.where(`participants.${userId}`, '==', true))
      .valueChanges().pipe(tap(rooms => console.log('rooms for %O are: %O', userId, rooms)), shareReplay(1));
  }

  /**
   *
   * @param chatRoomId
   * switches chatroom to room with given id, and nexting messages for that room
   */
  switchChatroom(chatRoomId: any) {
    console.log('switching to %O', chatRoomId);
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

  getChatroomParticipants(chatroomId): Observable<User[]> {
    return this.db.collection<User>(`chatrooms/${chatroomId}/participantsList`).valueChanges();
  }

  addToChatroom(chatroomId, user: User): Observable<DocumentReference> {
    console.log('addTOChatroom: %O user: %O', chatroomId, user);
    return fromPromise(this.db.doc<{ [id: string]: boolean }>(`chatrooms/${chatroomId}`).update({[`participants.${user.uid}`]: true})
      .then(_ => this.db.collection(`chatrooms/${chatroomId}/participantsList`).add(user)));
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

  /**
   * @param roomAdmin - person, who invites
   * @param invitedPerson - person, beeing invited
   */
  createRoomFor(roomAdmin: User, invitedPerson: User): Observable<string> {
    return fromPromise(this.db.collection<NewChatroom>(`chatrooms/`).add({name: 'Private room', participants: {
        [roomAdmin.uid]: true,
        [invitedPerson.uid]: true
      }})
      .then(roomRef => {
        roomRef.update('id', roomRef.id);
        roomRef.collection('participantsList').add(roomAdmin);
        roomRef.collection('participantsList').add(invitedPerson);
        return roomRef.id;
      }));
  }
}
