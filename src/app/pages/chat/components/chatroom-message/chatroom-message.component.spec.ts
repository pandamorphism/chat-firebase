import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomMessageComponent } from './chatroom-message.component';

describe('ChatroomMessageComponent', () => {
  let component: ChatroomMessageComponent;
  let fixture: ComponentFixture<ChatroomMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatroomMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
