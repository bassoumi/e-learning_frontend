import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { AgendaComponent } from './agenda.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AgendaComponent,

  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    ReactiveFormsModule,

  ]
})
export class AgendaModule { }
