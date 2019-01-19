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
export class ChatroomWindowComponent {
  constructor() {}
}
