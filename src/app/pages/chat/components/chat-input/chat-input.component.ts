import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChatroomService} from '../../../../shared/services/chatroom.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {
  inputForm: FormGroup;

  constructor(private fb: FormBuilder,
              private chatroomService: ChatroomService) {
  }

  ngOnInit() {
    this.inputForm = this.fb.group({
      messageInput: ['', [Validators.required]],
    });
  }

  submit() {
    this.chatroomService.createMessage(this.inputForm.controls.messageInput.value);
    this.inputForm.reset();
  }
}
