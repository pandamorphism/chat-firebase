import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../../../../shared/model/message';
import {Chatroom} from '../../../../shared/model/chatroom';
import {CdkScrollable} from '@angular/cdk/overlay';
import {interval, Subject, Subscription} from 'rxjs';
import {delay, distinctUntilChanged, filter, map, switchMap, take, tap, throttleTime} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {ChatroomService} from '../../../../shared/services/chatroom.service';

@Component({
  selector: 'app-chat-messages-page',
  templateUrl: './chat-messages-page.component.html',
  styleUrls: ['./chat-messages-page.component.scss']
})
export class ChatMessagesPageComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: Message[] = [];
  chatroom: Chatroom;
  private isScrollingSubj: Subject<boolean> = new Subject();
  isScrolling = this.isScrollingSubj.asObservable().pipe(distinctUntilChanged(), tap(_ => this.cd.detectChanges()));
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private chatroomService: ChatroomService,
              private cd: ChangeDetectorRef) {
    this.subscriptions.push(this.route.paramMap.pipe(
      map(param => param.get('id')),
      tap(id => console.log(`id: ${id}`)),
      tap(chatId => this.chatroomService.switchChatroom(chatId))
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
        tap(_ => this.cd.markForCheck()),
        filter(_ => this.scrollable !== undefined),
        delay(300),
        tap(_ => this.scrollable.scrollTo({behavior: 'smooth', bottom: 0})),
      )
        .subscribe());

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.scrollable.elementScrolled()
      .pipe(
        throttleTime(300),
        tap(_ => this.isScrollingSubj.next(true)),
        switchMap(_ => interval(500).pipe(take(1), tap(_ => this.isScrollingSubj.next(false))))
      ).subscribe());
  }
}
