import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  minPwdLength = 8;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.minPwdLength)]],
    });
  }

  submit() {
    console.log('sign up...%O', this.signupForm.value);
  }
}
