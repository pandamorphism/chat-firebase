import { Component, OnInit } from '@angular/core';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {Observable} from 'rxjs';
import {Chatroom} from '../../../../shared/model/chatroom';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit {

  constructor(private chatroomService: ChatroomService) { }

  ngOnInit() {
  }

  get chatrooms$(): Observable<Chatroom[]> {
    return this.chatroomService.chatrooms$;
  }
}
