import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomParticipantsComponent } from './room-participants.component';

describe('RoomParticipantsComponent', () => {
  let component: RoomParticipantsComponent;
  let fixture: ComponentFixture<RoomParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
