import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWelcomePageComponent } from './chat-welcome-page.component';

describe('ChatWelcomePageComponent', () => {
  let component: ChatWelcomePageComponent;
  let fixture: ComponentFixture<ChatWelcomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWelcomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
