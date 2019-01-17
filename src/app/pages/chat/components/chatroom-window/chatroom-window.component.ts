import {Component, OnDestroy, OnInit} from '@angular/core';
import {dummyData} from './dummy-data';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {filter, map, tap} from 'rxjs/operators';
import {NOT_NULL} from '../../../../shared/misc/pure.utils';
import {Chatroom} from '../../../../shared/model/chatroom';
import {LoadingService} from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy {
  dummyData = dummyData;
  chatroom: Chatroom;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private chatroomService: ChatroomService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.route.firstChild.paramMap.pipe(
      map(param => param.get('id')),
      filter(NOT_NULL),
      tap(chatId => this.chatroomService.changeChatroom(chatId))
    ).subscribe());
    this.subscriptions.push(this.chatroomService.currentChatroom$.pipe(
      tap(chatroom => this.chatroom = chatroom),
    )
      .subscribe());
  }

  ngOnDestroy(): void {
    console.log('DESTROY');
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
