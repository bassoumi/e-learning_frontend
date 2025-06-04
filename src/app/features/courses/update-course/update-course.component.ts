import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Course, Content, Quiz, Question } from 'src/app/core/models/course.model';
import { CategoryService } from '../../categories/services/category.service';
import { InstructorService } from '../../instructors/services/instructor.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss'],
})
export class UpdateCourseComponent implements OnInit {
  courseForm!: FormGroup;
  categories: any[] = [];
  instructors: any[] = [];
  coverFile: File | null = null;
  existingCoverUrl: string = '';
  courseId!: number;
  currentStep = 0;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategoryService,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Récupérer l'ID du cours depuis l'URL
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    // 2) Initialiser le FormGroup AVANT tout appel à l'API
    this.courseForm = this.fb.group({
      title:           ['', Validators.required],
      description:     ['', Validators.required],
      shortDescription:[''],
      categoryId:      [null, Validators.required],
      instructorId:    [null, Validators.required],
      level:           [''],
      language:        [''],
      contents:        this.fb.array([]),
      quiz:            this.fb.group({
        title:      [''],
        questions:  this.fb.array([]),
      }),
      courseMetaData:  this.fb.group({
        duration:   [null, Validators.required],
        tags:       this.fb.array([]),
        objectives: this.fb.array([]),
      }),
    });

    // 3) Charger parallèlement catégories, instructeurs et détails (array) du cours
    forkJoin({
      categories:  this.categorieService.getCategories(),
      instructors: this.instructorService.getInstructors(),
      courseArr:   this.courseService.getCourseById(this.courseId),
    }).subscribe({
      next: ({ categories, instructors, courseArr }) => {
        this.categories   = categories;
        this.instructors  = instructors;


        // 4) Comme getCourseById renvoie un tableau d’un seul élément, on prend le premier :
        if (!Array.isArray(courseArr) || courseArr.length === 0) {
          return;
        }
        const c: Course = courseArr[0];

        console.log('— c.title            =>', c.title);
        console.log('— c.description      =>', c.description);
        console.log('— c.categoryId       =>', c.categoryId);
        console.log('— c.instructorId     =>', c.instructorId);
        console.log('— c.courseMetaData   =>', c.courseMetaData);
        console.log('— c.quiz             =>', c.quiz);
        console.log('— c.contents         =>', c.contents);

        // 5) Récupérer les objets imbriqués (s’ils existent)
        const metaData = c.courseMetaData || {
          createdAt:   '',
          updatedAt:   '',
          duration:    0,
          tags:        [],
          objectives:  [],
        };
        // Si quiz est null, on crée un objet vide pour pouvoir patcher
        const quizObj: { title: string; questions: Question[] } = c.quiz
          ? { title: c.quiz.title, questions: c.quiz.questions }
          : { title: '', questions: [] };

        // 6) PatchValue : on pointe bien sur 'c.' et non sur 'courseArr'
        this.courseForm.patchValue({
          title:            c.title,
          description:      c.description,
          shortDescription: c.shortDescription || '',
          categoryId:       c.categoryId,
          instructorId:     c.instructorId,
          level:            c.level || '',
          language:         c.language || '',
          courseMetaData: {
            duration:      metaData.duration,
          },
          quiz: {
            title:         quizObj.title,
          },
        });


        // 7) Stocker l’URL de la couverture existante
        this.existingCoverUrl = c.coverImage || '';

        // 8) Remplir le FormArray “contents”
        const contentsArray = this.courseForm.get('contents') as FormArray;
        while (contentsArray.length) {
          contentsArray.removeAt(0);
        }
        (c.contents || []).forEach((cnt: Content) => {
          contentsArray.push(
            this.fb.group({
              title:        [cnt.title,       Validators.required],
              videoUrl:     [cnt.videoUrl,    Validators.required],
              description:  [cnt.description, Validators.required],
              orderContent: [cnt.orderContent],
            })
          );
        });

        // 9) Remplir le FormArray “quiz.questions”
        const questionsArray = (this.courseForm.get('quiz') as FormGroup).get('questions') as FormArray;
        while (questionsArray.length) {
          questionsArray.removeAt(0);
        }
        (quizObj.questions || []).forEach((q: Question) => {
          const optsArray = this.fb.array([]);
          (q.options || []).forEach(opt => {
            optsArray.push(this.fb.control(opt, Validators.required));
          });
          questionsArray.push(
            this.fb.group({
              text:    [q.text,    Validators.required],
              options: optsArray,
              answer:  [q.answer,  Validators.required],
            })
          );
        });

        // 10) Remplir le FormArray “tags”
        const tagsArray = (this.courseForm.get('courseMetaData') as FormGroup).get('tags') as FormArray;
        while (tagsArray.length) {
          tagsArray.removeAt(0);
        }
        (metaData.tags || []).forEach((tag: string) => {
          tagsArray.push(this.fb.control(tag, Validators.required));
        });

        // 11) Remplir le FormArray “objectives”
        const objectivesArray = (this.courseForm.get('courseMetaData') as FormGroup).get('objectives') as FormArray;
        while (objectivesArray.length) {
          objectivesArray.removeAt(0);
        }
        (metaData.objectives || []).forEach((obj: string) => {
          objectivesArray.push(this.fb.control(obj, Validators.required));
        });

      },
      error: err => {
      },
    });
  }

  // Getters pour accéder aux FormArray / FormGroup imbriqués
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
    return (this.courseForm.get('courseMetaData') as FormGroup).get('tags') as FormArray;
  }
  get objectives(): FormArray {
    return (this.courseForm.get('courseMetaData') as FormGroup).get('objectives') as FormArray;
  }

  // Méthodes pour ajouter/supprimer dynamiquement des champs FormArray
  addContent(): void {
    this.contents.push(
      this.fb.group({
        title:        ['', Validators.required],
        videoUrl:     ['', Validators.required],
        description:  ['', Validators.required],
        orderContent: [this.contents.length + 1],
      })
    );
  }
  removeContent(index: number): void {
    this.contents.removeAt(index);
  }

  addQuestion(): void {
    this.quizQuestions.push(
      this.fb.group({
        text: ['', Validators.required],
        options: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
        ]),
        answer: ['', Validators.required],
      })
    );
  }
  removeQuestion(index: number): void {
    this.quizQuestions.removeAt(index);
  }
  getOptions(questionIndex: number): FormArray {
    return this.quizQuestions.at(questionIndex).get('options') as FormArray;
  }
  addOption(questionIndex: number): void {
    this.getOptions(questionIndex).push(this.fb.control('', Validators.required));
  }
  removeOption(questionIndex: number, optionIndex: number): void {
    this.getOptions(questionIndex).removeAt(optionIndex);
  }

  addTag(): void {
    this.tags.push(this.fb.control('', Validators.required));
  }
  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  addObjective(): void {
    this.objectives.push(this.fb.control('', Validators.required));
  }
  removeObjective(index: number): void {
    this.objectives.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.coverFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      return;
    }

    const f = this.courseForm.value;
    const fd = new FormData();
    fd.append('title', f.title);
    fd.append('description', f.description);
    fd.append('shortDescription', f.shortDescription || '');
    fd.append('categoryId', f.categoryId.toString());
    fd.append('level', f.level || '');
    fd.append('language', f.language || '');
    fd.append('instructorId', f.instructorId.toString());
    fd.append('id', this.courseId.toString());

    if (this.coverFile) {
      fd.append('coverImage', this.coverFile);
    }

    const contentsBlob = new Blob([JSON.stringify(f.contents)], { type: 'application/json' });
    fd.append('contents', contentsBlob, 'contents.json');

    const quizBlob = new Blob([JSON.stringify(f.quiz)], { type: 'application/json' });
    fd.append('quiz', quizBlob, 'quiz.json');

    const metaBlob = new Blob([JSON.stringify(f.courseMetaData)], { type: 'application/json' });
    fd.append('metadata', metaBlob, 'metadata.json');

    this.courseService.updateCourseWithFile(this.courseId, fd).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error updating course:', err);
      },
    });
  }

  // Navigation entre les étapes
  nextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}