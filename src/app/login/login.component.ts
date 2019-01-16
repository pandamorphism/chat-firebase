import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, timer} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';
import {delay, filter, finalize, tap} from 'rxjs/operators';
import {LoadingService} from '../shared/services/loading.service';
import {AuthService} from '../shared/services/auth.service';
import {IS_TRUE} from '../shared/misc/pure.utils';
import {LoginModel} from '../shared/model/view.model';

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
      filter(IS_TRUE),
      tap(_ => this.alertService.success('You`ve been logged in successfully.')),
      tap(_ => this.router.navigate(['/chat'])),
      finalize(() => this.loadingService.stop())
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
