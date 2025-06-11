import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatbotComponent

  ],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    ReactiveFormsModule
  ]
})
export class ChatbotModule { }
