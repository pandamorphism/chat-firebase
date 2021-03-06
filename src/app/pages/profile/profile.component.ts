import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {exhaustMap, filter, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {tag} from 'rxjs-spy/operators';
import {NOT_EMPTY} from '../../shared/misc/pure.utils';
import {UserService} from '../../shared/services/user.service';
import {combineLatest, Observable} from 'rxjs';
import {User} from '../../shared/model/user';
import {AuthService} from '../../shared/services/auth.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ChatroomService} from '../../shared/services/chatroom.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  private isCurrentUserProfile$: Observable<boolean>;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private chatroomService: ChatroomService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      map(params => params.get('profileId')),
      filter(NOT_EMPTY),
      switchMap((id: string) => this.userService.getById(id)),
      shareReplay(1),
      tag('profileGetterStream'),
      untilDestroyed(this)
    );
    this.isCurrentUserProfile$ = combineLatest(this.user$, this.authService.currentUser$)
      .pipe(map(([profile, currentUser]) => profile && currentUser && profile.uid === currentUser.uid), untilDestroyed(this));
  }

  ngOnDestroy(): void {
  }

  navigateEditProfile(id: string) {
    this.router.navigate(['profile', id, 'edit']);
  }

  inviteToDirectChat(invitedUser: User) {
    this.authService.currentUser$.pipe(
      exhaustMap(currentUser => this.chatroomService.createRoomFor(currentUser, invitedUser)),
      tap(roomId => this.router.navigate(['/chat', roomId])),
      take(1)).subscribe();
  }
}
