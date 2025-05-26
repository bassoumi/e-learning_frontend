import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.module').then(m => m.CoursesModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/categories/categories.module').then(m => m.CategoriesModule),
  },
  {
    path: 'contents',
    loadChildren: () =>
      import('./features/contents/contents.module').then(m => m.ContentsModule),
  },
  {
    path: 'quizzes',
    loadChildren: () =>
      import('./features/quizzes/quizzes.module').then(m => m.QuizzesModule),
  },
  {
    path: 'instructors',
    loadChildren: () =>
      import('./features/instructors/instructors.module').then(m => m.InstructorsModule),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./features/students/students.module').then(m => m.StudentsModule),
  },
  {
    path: 'enrollments',
    loadChildren: () =>
      import('./features/enrollments/enrollments.module').then(m => m.EnrollmentsModule),
  },
  {
    path: 'progression',
    loadChildren: () =>
      import('./features/progression/progression.module').then(m => m.ProgressionModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  // default & fallback
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
