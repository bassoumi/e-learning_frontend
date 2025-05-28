import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCoursesComponent } from './list-courses/list-courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { StartCourseComponent } from './start-course/start-course.component';
import { QuizCourseComponent } from './quiz-course/quiz-course.component';

const routes: Routes = [
  {path: '',component:ListCoursesComponent},
  {path: 'course-detail/:id', component: CourseDetailComponent},
  {path: 'course-play/:id', component: StartCourseComponent},
  {path: 'courses/:id/quiz', component: QuizCourseComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
