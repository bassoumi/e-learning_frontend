import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserMessage, BotMessage } from 'src/app/core/models/chatbot.model';
import { ChatbotService } from '../service/chatbot.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  chatForm!: FormGroup;
  chatHistory: { sender: 'user' | 'bot'; text: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private chatbotService: ChatbotService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  sendUserMessage(): void {
    const userId = this.authService.getLoggedInStudentId();
    const userMessage = this.chatForm.value.message?.trim();

    if (!userId || !userMessage) {
      return;
    }
    console.log('User ID:', userId);
    console.log('User Message:', userMessage);

    const message: UserMessage = {
      userId: userId.toString(),
      text: userMessage
    };

    this.chatHistory.push({ sender: 'user', text: userMessage });

    this.chatbotService.sendMessage(message).subscribe({
      next: (response: BotMessage) => {
        this.chatHistory.push({ sender: 'bot', text: response.text });
        this.chatForm.reset();
      },
      error: () => {
        this.chatHistory.push({ sender: 'bot', text: 'Sorry, something went wrong.' });
      }
    });
  }
}
