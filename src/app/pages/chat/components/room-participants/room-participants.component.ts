import {Component, OnInit} from '@angular/core';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {delay, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {User} from '../../../../shared/model/user';
import {tag} from 'rxjs-spy/operators';

@Component({
  selector: 'app-room-participants',
  templateUrl: './room-participants.component.html',
  styleUrls: ['./room-participants.component.scss']
})
export class RoomParticipantsComponent implements OnInit {

  roomParticipants$: Observable<User[]>;

  // todo: refactor to make this component dumb
  constructor(private chatroomService: ChatroomService) {
  }

  ngOnInit() {
    this.roomParticipants$ = this.chatroomService.currentChatroom$.pipe(
      delay(0), // expression changed after it was checked
      tap(selectedRoom => console.log('retrieving participants for: %O', selectedRoom)),
      switchMap(selectedRoom => selectedRoom && this.chatroomService.getChatroomParticipants(selectedRoom.id) || of([])),
      tag('roomParticipants')
    );
  }

}
