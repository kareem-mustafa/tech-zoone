// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    };
  }

  // جلب بيانات البروفايل
  getProfile(): Observable<User> {
    const user = localStorage.getItem('user');
    if (!user) throw new Error('User not logged in');
    const userId = JSON.parse(user)._id;
    return this.http.get<User>(
      `${this.baseUrl}/${userId}`,
      this.getAuthHeaders()
    );
  }

  // تحديث كلمة المرور فقط
  updatePassword(data: {
    email: string;
    password: string; // الباسورد القديم
    newpassword: string; // الباسورد الجديد
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/update`,
      data,
      this.getAuthHeaders()
    );
  }
}
