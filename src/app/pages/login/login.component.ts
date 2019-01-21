import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {AlertService} from '../../shared/services/alert.service';
import {catchError, filter, tap} from 'rxjs/operators';
import {LoadingService} from '../../shared/services/loading.service';
import {AuthService} from '../../shared/services/auth.service';
import {NOT_NULL} from '../../shared/misc/pure.utils';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private returnUrl: string;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private loadingService: LoadingService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.createForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
    this.auth.currentUser$.pipe(
      filter(NOT_NULL),
      tap(_ => this.router.navigateByUrl('/chat')),
      untilDestroyed(this)
    )
      .subscribe();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit() {
    this.loadingService.start();
    this.subscriptions.push(this.auth.login(this.loginForm.value).pipe(
      catchError(err => {
        this.alertService.error(err.message);
        console.error(err);
        return throwError(err);
      }),
      tap(_ => this.alertService.success('You`ve been logged in successfully.')),
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
