import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesModifyComponent } from './articles-modify.component';

describe('ModifyArticlesComponent', () => {
  let component: ArticlesModifyComponent;
  let fixture: ComponentFixture<ArticlesModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticlesModifyComponent]
    });
    fixture = TestBed.createComponent(ArticlesModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
