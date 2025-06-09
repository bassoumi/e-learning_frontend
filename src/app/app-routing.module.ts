import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

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
    canActivate: [authGuard],
    data: { roles: ['INSTRUCTOR','ADMIN'] }
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
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notification/notification.module').then(m => m.NotificationModule),
  },
  {
    path: 'agenda',
    loadChildren: () =>
      import('./features/agenda/agenda.module').then(m => m.AgendaModule),
  },
  // default & fallback
  
  { path: 'agenda', loadChildren: () => import('./features/agenda/agenda.module').then(m => m.AgendaModule) },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },


  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) ,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },

  {path: '', redirectTo: 'courses', pathMatch: 'full'},

  {
    path: '**',
    component: NotFoundComponent
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
