import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersCreateComponent } from './members-create.component';

describe('MembersCreateComponent', () => {
  let component: MembersCreateComponent;
  let fixture: ComponentFixture<MembersCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersCreateComponent]
    });
    fixture = TestBed.createComponent(MembersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
