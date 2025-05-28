import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCourseComponent } from './quiz-course.component';

describe('QuizCourseComponent', () => {
  let component: QuizCourseComponent;
  let fixture: ComponentFixture<QuizCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizCourseComponent]
    });
    fixture = TestBed.createComponent(QuizCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
