import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {
  inputForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.inputForm = this.fb.group({
      messageInput: ['', [Validators.required]],
    });
  }

  submit() {
    console.log('sending message: %O', this.inputForm.controls.messageInput.value);
    this.inputForm.reset();
  }
}
