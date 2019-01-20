import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {tag} from 'rxjs-spy/operators';
import {NOT_EMPTY} from '../../shared/misc/pure.utils';
import {UserService} from '../../shared/services/user.service';
import {combineLatest, Observable} from 'rxjs';
import {User} from '../../shared/model/user';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  private user$: Observable<User>;
  private isCurrentUserProfile$: Observable<boolean>;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private userService: UserService) {
    this.user$ = this.route.paramMap.pipe(
      map(params => params.get('profileId')),
      filter(NOT_EMPTY),
      tap(profileId => console.log('profileId: %O', profileId)),
      switchMap((id: string) => this.userService.getById(id)),
      tag('profileGetterStream')
    );
    this.isCurrentUserProfile$ = combineLatest(this.user$, this.authService.currentUser$)
      .pipe(map(([profile, currentUser]) => profile.uid === currentUser.uid));
  }

  ngOnInit() {
    // this.profileForm = this.fb.group({
    //   firstName: ['', [Validators.required]],
    //   lastName: ['', [Validators.required]],
    //   quote: [''],
    // });
    // this.auth.currentUser$.pipe(
    //   tap(({firstName, lastName, quote}) => this.profileForm.setValue({firstName, lastName, quote})),
    //   take(1)
    // ).subscribe();
  }


  submit() {
    console.log('update profile: %O', this.profileForm.value);
  }

  ngOnDestroy(): void {
  }
}
