import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {AlertService} from '../shared/services/alert.service';
import {LoadingService} from '../shared/services/loading.service';
import {Subscription} from 'rxjs';
import {filter, finalize, tap} from 'rxjs/operators';
import {IS_TRUE} from '../shared/misc/pure.utils';
import {Router} from '@angular/router';

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
    this.loadingService.start();
    this.subscriptions.push(this.auth.signup(this.signupForm.value).pipe(
      filter(IS_TRUE),
      tap(_ => this.alertService.success('You`ve been logged in successfully.')),
      tap(_ => this.router.navigate(['/chat'])),
      finalize(() => this.loadingService.stop()),
    ).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
