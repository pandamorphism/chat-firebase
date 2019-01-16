import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

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
              // private loadingService: LoadingService,
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
    // TODO call the auth service
    const {email, password} = this.loginForm.value;
    console.log(`Email: ${email}, Password: ${password}`);
    this.alertService.error('Your email or password were invalid, try again.');
    // this.router.navigate(['/chat']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
