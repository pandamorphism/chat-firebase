import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {Observable} from 'rxjs';
import {Chatroom} from '../../../../shared/model/chatroom';
import {AuthService} from '../../../../shared/services/auth.service';
import {NOT_NULL} from '../../../../shared/misc/pure.utils';
import {filter, switchMap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {User} from '../../../../shared/model/user';
import {tag} from 'rxjs-spy/operators';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.scss']
})
export class ChatroomListComponent implements OnInit, OnDestroy {

  chatrooms$: Observable<Chatroom[]>;

  constructor(private chatroomService: ChatroomService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.chatrooms$ = this.auth.currentUser$.pipe(
      filter(NOT_NULL),
      switchMap((user: User) => this.chatroomService.getChatroomsByUserId(user.uid)),
      untilDestroyed(this),
      tag('chatrooms for user')
    );
  }

  ngOnDestroy(): void {
  }
}
