import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Quiz } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz-course',
  templateUrl: './quiz-course.component.html',
  styleUrls: ['./quiz-course.component.scss']
})
export class QuizCourseComponent {
  course!: Course;
  quizForm!: FormGroup;
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
      next: (data) => {
        this.course = Array.isArray(data) ? data[0] : data;
        this.initQuizForm(this.course.quiz!);
        console.log('Course loaded:', this.course.quiz);
      },
      error: (err) => console.error('Error loading course:', err)
    });
  }

  private initQuizForm(quiz: Quiz) {
    const questionGroups = quiz.questions.map((q, idx) => this.fb.group({
      question: new FormControl(q, Validators.required),
      selectedAnswer: new FormControl(null, Validators.required),
      options: new FormControl(
        Array.isArray(quiz.options[idx]) ? quiz.options[idx] : [quiz.options[idx]]
      )    }));

    this.quizForm = this.fb.group({
      questions: this.fb.array(questionGroups)
    });
  }

  get questions(): FormArray<FormGroup> {
    return this.quizForm.get('questions') as FormArray<FormGroup>;
  }

  onSubmit() {
    this.submitted = true;

    if (this.quizForm.invalid) {
      return;
    }

    const answers = this.questions.controls.map((group, i) => {
      const q = group.get('question')?.value;
      const ans = group.get('selectedAnswer')?.value;
      return { question: q, answer: ans };
    });
    console.log('User answers:', answers);
    // TODO: send to backend or evaluate score

    this.router.navigate(['/courses', this.course.id, 'result']);
  }
}
