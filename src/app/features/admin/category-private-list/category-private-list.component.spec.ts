import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPrivateListComponent } from './category-private-list.component';

describe('CategoryPrivateListComponent', () => {
  let component: CategoryPrivateListComponent;
  let fixture: ComponentFixture<CategoryPrivateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryPrivateListComponent]
    });
    fixture = TestBed.createComponent(CategoryPrivateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
