import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatroomWindowComponent {
  constructor() {}
}
