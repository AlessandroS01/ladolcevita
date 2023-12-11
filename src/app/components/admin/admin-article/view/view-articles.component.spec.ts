import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesViewComponent } from './view-articles.component';

describe('ViewArticlesComponent', () => {
  let component: ArticlesViewComponent;
  let fixture: ComponentFixture<ArticlesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesViewComponent]
    });
    fixture = TestBed.createComponent(ArticlesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
