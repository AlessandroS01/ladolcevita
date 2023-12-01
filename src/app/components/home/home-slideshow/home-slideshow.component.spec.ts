import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSlideshowComponent } from './home-slideshow.component';

describe('HomeSlideshowComponent', () => {
  let component: HomeSlideshowComponent;
  let fixture: ComponentFixture<HomeSlideshowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeSlideshowComponent]
    });
    fixture = TestBed.createComponent(HomeSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
