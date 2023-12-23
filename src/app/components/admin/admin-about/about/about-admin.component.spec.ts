import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAdminComponent } from './about-admin.component';

describe('AboutComponent', () => {
  let component: AboutAdminComponent;
  let fixture: ComponentFixture<AboutAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutAdminComponent]
    });
    fixture = TestBed.createComponent(AboutAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
