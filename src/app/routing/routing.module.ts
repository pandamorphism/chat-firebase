import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {SignupComponent} from '../signup/signup.component';
import {ChatComponent} from '../pages/chat/chat.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {ChatWelcomePageComponent} from '../pages/chat/components/chat-welcome-page/chat-welcome-page.component';
import {ChatMessagesPageComponent} from '../pages/chat/components/chat-messages-page/chat-messages-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: ChatWelcomePageComponent},
      {path: ':id', component: ChatMessagesPageComponent}
    ]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {enableTracing: false})
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
