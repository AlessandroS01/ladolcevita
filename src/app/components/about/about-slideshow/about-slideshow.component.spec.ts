import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSlideshowComponent } from './about-slideshow.component';

describe('AboutSlideshowComponent', () => {
  let component: AboutSlideshowComponent;
  let fixture: ComponentFixture<AboutSlideshowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutSlideshowComponent]
    });
    fixture = TestBed.createComponent(AboutSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
