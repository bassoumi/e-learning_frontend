import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DurationPipe } from './pipes/duration.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    HasRoleDirective,
    DateFormatPipe,
    SidebarNavComponent,
    DurationPipe,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    NavbarComponent,
    SidebarNavComponent,
    DurationPipe,
    OrderByPipe
  ]
})
export class SharedModule { }
