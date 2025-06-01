import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatIconModule
  ]
})
export class NotificationModule { }
