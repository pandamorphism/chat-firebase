import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginComponent} from './pages/login/login.component';
import {RoutingModule} from './routing/routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './shared/material/material.module';
import {SignupComponent} from './pages/signup/signup.component';
import {ChatComponent} from './pages/chat/chat.component';
import {NavbarComponent} from './layout/navbar/navbar.component';
import {ChatInputComponent} from './pages/chat/components/chat-input/chat-input.component';
import {ChatroomListComponent} from './pages/chat/components/chatroom-list/chatroom-list.component';
import {ChatroomTitleBarComponent} from './pages/chat/components/chatroom-title-bar/chatroom-title-bar.component';
import {ChatroomMessageComponent} from './pages/chat/components/chatroom-message/chatroom-message.component';
import {ChatroomWindowComponent} from './pages/chat/components/chatroom-window/chatroom-window.component';
import {NgxLoadingModule} from 'ngx-loading';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { ChatMessagesPageComponent } from './pages/chat/components/chat-messages-page/chat-messages-page.component';
import { ChatWelcomePageComponent } from './pages/chat/components/chat-welcome-page/chat-welcome-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChatComponent,
    NavbarComponent,
    ChatInputComponent,
    ChatroomListComponent,
    ChatroomTitleBarComponent,
    ChatroomMessageComponent,
    ChatroomWindowComponent,
    ChatMessagesPageComponent,
    ChatWelcomePageComponent,
    ProfileComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
