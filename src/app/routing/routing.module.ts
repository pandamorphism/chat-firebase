import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../pages/login/login.component';
import {SignupComponent} from '../pages/signup/signup.component';
import {ChatComponent} from '../pages/chat/chat.component';
import {AuthGuard} from '../shared/guards/auth.guard';
import {ChatWelcomePageComponent} from '../pages/chat/components/chat-welcome-page/chat-welcome-page.component';
import {ChatMessagesPageComponent} from '../pages/chat/components/chat-messages-page/chat-messages-page.component';
import {ProfileComponent} from '../pages/profile/profile.component';
import {EditProfileComponent} from '../pages/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/chat'
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
    path: 'profile/:profileId',
    canActivate: [AuthGuard],
    component: ProfileComponent
  },
  {
    path: 'profile/:profileId/edit',
    canActivate: [AuthGuard],
    component: EditProfileComponent
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
