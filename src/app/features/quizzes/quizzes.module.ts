import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizzesRoutingModule } from './quizzes-routing.module';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizDetailComponent } from './quiz-detail/quiz-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    QuizListComponent,
    QuizDetailComponent
  ],
  imports: [
    CommonModule,
    QuizzesRoutingModule,
    ReactiveFormsModule
  ]
})
export class QuizzesModule { }
