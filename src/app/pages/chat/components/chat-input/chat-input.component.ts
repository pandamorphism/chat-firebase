import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChatroomService} from '../../../../shared/services/chatroom.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {finalize, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;

  constructor(private fb: FormBuilder,
              private chatroomService: ChatroomService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.inputForm = this.fb.group({
      messageInput: ['', [Validators.required]],
    });
  }

  submit() {
    this.auth.currentUser$.pipe(
      tap(user => this.chatroomService.createMessage(this.inputForm.controls.messageInput.value, user)),
      take(1),
      finalize(() => this.inputForm.reset())
    )
      .subscribe();

  }

  ngOnDestroy(): void {
  }
}
