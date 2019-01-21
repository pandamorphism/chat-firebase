import { Component, OnInit } from '@angular/core';
import {ChatroomService} from '../../../../shared/services/chatroom.service';

@Component({
  selector: 'app-chat-welcome-page',
  templateUrl: './chat-welcome-page.component.html',
  styleUrls: ['./chat-welcome-page.component.scss']
})
export class ChatWelcomePageComponent implements OnInit {

  constructor(private chatroomService: ChatroomService) { }

  ngOnInit() {
    this.chatroomService.switchChatroom(null);
  }

}
