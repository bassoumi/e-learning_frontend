import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstructorComponent } from './list-instructor.component';

describe('ListInstructorComponent', () => {
  let component: ListInstructorComponent;
  let fixture: ComponentFixture<ListInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInstructorComponent]
    });
    fixture = TestBed.createComponent(ListInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
