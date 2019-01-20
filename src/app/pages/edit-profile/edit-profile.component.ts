import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {take, tap} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private auth: AuthService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      quote: [''],
    });
    this.auth.currentUser$.pipe(
      tap(({firstName, lastName, quote}) => this.profileForm.setValue({firstName, lastName, quote})),
      take(1)
    ).subscribe();
  }

}
