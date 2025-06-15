import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course, Content, Quiz } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { CategoryService } from '../../categories/services/category.service';
import { InstructorService } from '../../instructors/services/instructor.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  currentStep = 0;
  courseForm!: FormGroup;
  categories: any[] = [];
  instructors: any[] = [];
  coverFile!: File;
  connectedInstructorId: number | null = null;

  constructor(private fb: FormBuilder, 
              private categorieService: CategoryService,
              private instructorService: InstructorService,
              private courseService: CourseService,
              private authService:AuthService
          ) {}

  ngOnInit(): void {
    this.categorieService.getCategories().subscribe(data => {
      this.categories = data;
      console.log('Categories loaded:', this.categories);
    });
  
    this.instructorService.getInstructors().subscribe(data => {
      this.instructors = data;
      console.log('Instructors loaded:', this.instructors);
    });
  
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      shortDescription: [''],
      categoryId: [null, Validators.required],
      instructorId: [null, Validators.required],
      level: [''],
      language: [''],
      contents: this.fb.array([]),
      quiz: this.fb.group({
        title: [''],
        questions: this.fb.array([])
      }),
      courseMetaData: this.fb.group({
        duration: [null, Validators.required],
        tags: this.fb.array([]),
        objectives: this.fb.array([])
      })
    });

    const uid = this.authService.getLoggedInStudentId();
    if (uid !== null) {
      this.connectedInstructorId = uid;
      this.courseForm.get('instructorId')!.setValue(uid);
    }
  }

  // Navigation methods
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // Form array getters
  get contents(): FormArray {
    return this.courseForm.get('contents') as FormArray;
  }

  get quiz(): FormGroup {
    return this.courseForm.get('quiz') as FormGroup;
  }

  get quizQuestions(): FormArray {
    return this.quiz.get('questions') as FormArray;
  }

  get tags(): FormArray { 
    return this.courseForm.get('courseMetaData.tags') as FormArray; 
  }

  get objectives(): FormArray { 
    return this.courseForm.get('courseMetaData.objectives') as FormArray; 
  }

  // Add dynamic fields
  addContent() {
    this.contents.push(this.fb.group({
      title: ['', Validators.required],
      videoUrl: ['', Validators.required],
      description: ['', Validators.required],
      orderContent: [this.contents.length + 1]
    }));
  }

  removeContent(index: number) {
    this.contents.removeAt(index);
  }

  addQuestion() {
    this.quizQuestions.push(this.fb.group({
      text: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      answer: ['', Validators.required]
    }));
  }

  removeQuestion(index: number) {
    this.quizQuestions.removeAt(index);
  }

  getOptions(questionIndex: number): FormArray {
    return this.quizQuestions.at(questionIndex).get('options') as FormArray;
  }

  addOption(questionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  addTag() {
    this.tags.push(this.fb.control('', Validators.required));
  }

  removeTag(i: number) {
    this.tags.removeAt(i);
  }

  addObjective() {
    this.objectives.push(this.fb.control('', Validators.required));
  }

  removeObjective(i: number) {
    this.objectives.removeAt(i);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.coverFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) { return; }

    const f = this.courseForm.value;
    const fd = new FormData();

    fd.append('title', f.title);
    fd.append('description', f.description);
    fd.append('shortDescription', f.shortDescription || '');
    fd.append('categoryId', f.categoryId.toString());
    fd.append('level', f.level || '');
    fd.append('language', f.language || '');
    fd.append('instructorId', f.instructorId.toString());

    if (this.coverFile) {
      fd.append('coverImage', this.coverFile);
    }

    const contentsBlob = new Blob(
      [ JSON.stringify(f.contents) ],
      { type: 'application/json' }
    );
    fd.append('contents', contentsBlob, 'contents.json');

    const quizBlob = new Blob(
      [ JSON.stringify(f.quiz) ],
      { type: 'application/json' }
    );
    fd.append('quiz', quizBlob, 'quiz.json');

    const metaBlob = new Blob(
      [ JSON.stringify(f.courseMetaData) ],
      { type: 'application/json' }
    );
    fd.append('metadata', metaBlob, 'metadata.json');

    this.courseService.addCourseWithFile(fd).subscribe(
      () => {
        this.courseForm.reset();
        this.contents.clear();
        this.quizQuestions.clear();
        this.tags.clear();
        this.objectives.clear();
      },
      error => {
        console.error('Error submitting course:', error);
      }
    );
  }
}
