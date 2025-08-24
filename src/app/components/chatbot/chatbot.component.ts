import { Component, OnInit, Inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  messages: Message[] = [];
  userInput: string = '';
  userId: string = '';

  constructor(
    private chatService: ChatService,
    @Inject(AuthService) private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user._id) {
      this.userId = user._id;
      this.chatService.getUserMessages(this.userId).subscribe((res) => {
        if (res.messages) {
          this.messages = res.messages.map((m: any) => ({
            sender: m.reply ? 'bot' : 'user',
            text: m.reply || m.message,
          }));
        }
      });
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'user', text: this.userInput });
    const msg = this.userInput;
    this.userInput = '';

    this.chatService.sendMessage(msg).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'bot', text: res.reply });
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: 'something Wrong ,Try again',
        });
      },
    });
  }
}
