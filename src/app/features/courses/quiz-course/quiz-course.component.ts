import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Quiz } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz-course',
  templateUrl: './quiz-course.component.html',
  styleUrls: ['./quiz-course.component.scss']
})
export class QuizCourseComponent implements OnInit {
  course!: Course;

  @ViewChildren('questionBlock') questionBlocks!: QueryList<ElementRef>;


  // Form with a FormArray of FormGroups, each for one question
  quizForm!: FormGroup<{
    questions: FormArray<FormGroup<{ text: any; selectedAnswer: any; }>>
  }>;

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
  
    this.courseService.getCourseById(id).subscribe({
      next: (res: Course | Course[]) => {
        // If we got an array, pick the first element
        const course = Array.isArray(res) ? res[0] : res;
        this.course = course;
        console.log('Unwrapped course:', course);
  
        // Now the nested quiz will exist (assuming the API sent it)
        if (!course.quiz || !course.quiz.questions?.length) {
          console.error('No quiz data on this course!');
          return;
        }
  
        this.initQuizForm(course.quiz);
        this.correctAnswers = course.quiz.questions.map(q => q.answer);
      },
      error: err => console.error('Error loading course:', err)
    });
  }
  
  

  private initQuizForm(quiz: Quiz) {
    console.log('> initQuizForm, quiz.questions.length =', quiz.questions.length);

    // create a FormGroup per question with 'text' and 'selectedAnswer'
    const questionGroups = quiz.questions.map(q =>
      this.fb.group({
        text:           [ q.text, Validators.required ],
        selectedAnswer: [ null,   Validators.required ]
      })
    );

    this.quizForm = this.fb.group({
      questions: this.fb.array(questionGroups)
    }) as FormGroup<{ questions: FormArray<FormGroup<{ text: any; selectedAnswer: any; }>> }>;
  }

  get questions(): FormArray<FormGroup<{ text: any; selectedAnswer: any }>> {
    return this.quizForm.controls.questions;
  }



currentQuestionIndex = 0;
answeredQuestions: number[] = [];

goToQuestion(index: number) {
  this.currentQuestionIndex = index;
  this.scrollToQuestion(index);
}

onAnswerSelect(questionIndex: number) {
  // Mark as answered if not already
  if (!this.answeredQuestions.includes(questionIndex)) {
    this.answeredQuestions.push(questionIndex);
  }
  
  // Auto-advance to next question if not last
  if (questionIndex < this.questions.length - 1) {
    this.goToQuestion(questionIndex + 1);
  }
}

private scrollToQuestion(index: number) {
  setTimeout(() => {
    const element = this.questionBlocks.toArray()[index]?.nativeElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 10);
}

showAnswers = false;
correctAnswers: string[] = [];
userAnswers: string[] = [];
onSubmit() {
  this.submitted = true;
  if (this.quizForm.invalid) return;

  // Store user answers, casting each value to string
  this.userAnswers = this.questions.controls.map(group =>
    group.get('selectedAnswer')!.value as string
  );

  
  // Show answer feedback
  this.showAnswers = true;
  
  // Delay navigation to show feedback
  setTimeout(() => {
    this.router.navigate(['/courses', this.course.id, 'result']);
  }, 3000); // Show feedback for 3 seconds before navigating
}

// Add helper methods for answer styling
isCorrectAnswer(questionIndex: number, option: string): boolean {
  return this.showAnswers && option === this.correctAnswers[questionIndex];
}

isIncorrectAnswer(questionIndex: number, option: string): boolean {
  return this.showAnswers && 
         option === this.userAnswers[questionIndex] && 
         option !== this.correctAnswers[questionIndex];
}


}
