import {Component, OnInit} from '@angular/core';
import {dummyData} from './dummy-data';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit {

  dummyData = dummyData;

  constructor() { }

  ngOnInit() {
  }

}
