import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: token ? token : '',
    });
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/`,
      { message },
      { headers: this.getHeaders() }
    );
  }

  getUserMessages(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  getAllMessages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`, {
      headers: this.getHeaders(),
    });
  }

  sendAdminReply(message: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/reply`,
      { message },
      { headers: this.getHeaders() }
    );
  }
}
