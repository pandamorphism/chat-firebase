import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../../../shared/model/message';
import {Chatroom} from '../../../../shared/model/chatroom';
import {CdkScrollable} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {delay, filter, map, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ChatroomService} from '../../../../shared/services/chatroom.service';

@Component({
  selector: 'app-chat-messages-page',
  templateUrl: './chat-messages-page.component.html',
  styleUrls: ['./chat-messages-page.component.scss']
})
export class ChatMessagesPageComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  chatroom: Chatroom;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private chatroomService: ChatroomService) {
    this.subscriptions.push(this.route.paramMap.pipe(
      map(param => param.get('id')),
      tap(id => console.log(`id: ${id}`)),
      tap(chatId => this.chatroomService.changeChatroom(chatId))
    ).subscribe());
  }

  ngOnInit() {
    this.subscriptions.push(
      this.chatroomService.currentChatroom$.pipe(
        tap(chatroom => this.chatroom = chatroom),
      )
        .subscribe(),
      this.chatroomService.currentMessages$.pipe(
        tap(messages => this.messages = messages),
        filter(_ => this.scrollable !== undefined),
        delay(300),
        tap(_ => this.scrollable.scrollTo({behavior: 'smooth', bottom: 0})),
      )
        .subscribe());

  }

  ngOnDestroy(): void {
    console.log('destroying');
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
