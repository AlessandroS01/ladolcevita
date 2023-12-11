import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCreateComponent } from './articles-create.component';

describe('CreateArticlesComponent', () => {
  let component: ArticlesCreateComponent;
  let fixture: ComponentFixture<ArticlesCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesCreateComponent]
    });
    fixture = TestBed.createComponent(ArticlesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
