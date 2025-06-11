import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ChatbotComponent

  ],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    ReactiveFormsModule,
    MatIconModule
    
  ]
})
export class ChatbotModule { }
