import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {merge, Subscription} from 'rxjs';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {delay, filter, map, tap} from 'rxjs/operators';
import {NOT_NULL} from '../../../../shared/misc/pure.utils';
import {Chatroom} from '../../../../shared/model/chatroom';
import {Message} from '../../../../shared/model/message';
import {CdkScrollable} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  chatroom: Chatroom;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private chatroomService: ChatroomService) {
    this.subscriptions.push(merge(this.route.paramMap, this.route.firstChild.paramMap).pipe(
      map(param => param.get('id')),
      tap(id => console.log(`id: ${id}`)),
      filter(NOT_NULL),
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
