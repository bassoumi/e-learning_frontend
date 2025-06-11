import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserMessage, BotMessage } from 'src/app/core/models/chatbot.model';
import { ChatbotService } from '../service/chatbot.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  chatForm!: FormGroup;
  isTyping: boolean = false;
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

    const message: UserMessage = {
      userId: userId.toString(),
      text: userMessage
    };

    this.chatHistory.push({ sender: 'user', text: userMessage });

    this.chatbotService.sendMessage(message).subscribe({
      next: (responses) => {
        // responses est un BotMessage[]
        const firstBotMsg = Array.isArray(responses) && responses.length > 0
          ? responses[0].text
          : 'Désolé, pas de réponse du bot.';

        // **bold** → <strong>bold</strong>
        const formatted = firstBotMsg.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        this.chatHistory.push({ sender: 'bot', text: formatted });
        this.chatForm.reset();
      },
      error: () => {
        this.chatHistory.push({ sender: 'bot', text: 'Sorry, something went wrong.' });
      }
    });
  }
}
