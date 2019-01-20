import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from '../../shared/services/alert.service';
import {LoadingService} from '../../shared/services/loading.service';
import {Subscription} from 'rxjs';
import {filter, finalize, switchMap, tap} from 'rxjs/operators';
import {IS_TRUE, NOT_NULL} from '../../shared/misc/pure.utils';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  minPwdLength = 8;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private alertService: AlertService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.auth.currentUser$.pipe(filter(NOT_NULL), tap(_ => this.router.navigateByUrl('/chat')), untilDestroyed(this)).subscribe();
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
    this.subscriptions.push(this.auth.signup(this.signupForm.value).pipe(
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
