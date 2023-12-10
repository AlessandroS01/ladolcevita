import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsModifyComponent } from './events-modify.component';

describe('EventsModifyComponent', () => {
  let component: EventsModifyComponent;
  let fixture: ComponentFixture<EventsModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsModifyComponent]
    });
    fixture = TestBed.createComponent(EventsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
