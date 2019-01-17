import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {filter, map, tap} from 'rxjs/operators';
import {NOT_NULL} from '../../../../shared/misc/pure.utils';
import {Chatroom} from '../../../../shared/model/chatroom';
import {Message} from '../../../../shared/model/message';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  chatroom: Chatroom;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private chatroomService: ChatroomService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.route.firstChild.paramMap.pipe(
      map(param => param.get('id')),
      filter(NOT_NULL),
      tap(chatId => this.chatroomService.changeChatroom(chatId))
      ).subscribe(),
      this.chatroomService.currentChatroom$.pipe(
        tap(chatroom => this.chatroom = chatroom),
      )
        .subscribe(),
      this.chatroomService.currentMessages$.pipe(
        tap(messages => this.messages = messages)
      )
        .subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
