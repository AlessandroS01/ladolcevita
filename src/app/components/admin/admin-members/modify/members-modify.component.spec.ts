import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersModifyComponent } from './members-modify.component';

describe('MembersModifyComponent', () => {
  let component: MembersModifyComponent;
  let fixture: ComponentFixture<MembersModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersModifyComponent]
    });
    fixture = TestBed.createComponent(MembersModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
