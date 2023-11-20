import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchLangComponent } from './switch-lang.component';

describe('SwitchlangComponent', () => {
  let component: SwitchLangComponent;
  let fixture: ComponentFixture<SwitchLangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwitchLangComponent]
    });
    fixture = TestBed.createComponent(SwitchLangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
