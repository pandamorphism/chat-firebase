import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {take, tap} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {UserService} from '../../shared/services/user.service';
import {ActivatedRoute} from '@angular/router';
import {tag} from 'rxjs-spy/operators';
import {profileIdLens} from '../../shared/misc/pure.utils';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private userService: UserService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    profileIdLens.asOptional().getOption(this.route.snapshot.params as { profileId: string }).map(this.bindUserToForm.bind(this));
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      quote: [''],
    });
  }

  bindUserToForm(userId: string) {
    this.userService.getById(userId).pipe(
      tap(({firstName, lastName, quote}) => this.profileForm.setValue({firstName, lastName, quote})),
      take(1),
      tag('profileEditStream'),
    ).subscribe();
  }

  submit() {
    console.log('submitting...');
  }

  ngOnDestroy(): void {
  }
}
