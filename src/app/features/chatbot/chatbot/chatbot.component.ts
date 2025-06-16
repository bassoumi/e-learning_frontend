import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

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
    if (!userId || !userMessage) return;
  
    this.chatHistory.push({ sender: 'user', text: userMessage });
    this.chatForm.reset();
    this.isTyping = true;
  
    this.chatbotService.sendMessage({ userId: userId.toString(), text: userMessage })
      .subscribe({
        next: (responses) => {
          this.isTyping = false;
          const firstBotMsg = Array.isArray(responses) && responses.length > 0
            ? responses[0].text
            : 'Désolé, pas de réponse du bot.';
          const formatted = firstBotMsg.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          this.chatHistory.push({ sender: 'bot', text: formatted });
          // no need to manually scroll here
        },
        error: () => {
          this.isTyping = false;
          this.chatHistory.push({ sender: 'bot', text: 'Sorry, something went wrong.' });
        }
      });
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {
      console.warn('Scroll to bottom failed', err);
    }
  }
  
}
