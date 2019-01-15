import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Message} from '../../../../shared/model/message';

@Component({
  selector: 'app-chatroom-message',
  templateUrl: './chatroom-message.component.html',
  styleUrls: ['./chatroom-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatroomMessageComponent implements OnInit {
  @Input() message: Message;

  constructor() {
  }

  ngOnInit() {
  }

}
