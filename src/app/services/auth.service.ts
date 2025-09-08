import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from 'src/environments/environment';
export interface User {
  _id?: string;
  username?: string;
  email: string;
  phonenumber?: string;
  role?: string;
  storename?: string;
  isVerified?: boolean;
  gender?: string;
  address?: string;
  age?: number;
  BankAccount?: string;
  profileImage?: string;
  googleID?: string;
}

export interface AuthResponse {
  User: User;
  token?: string;
  message?: string;
}

export interface OtpResponse {
  message: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/user`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private cartService: CartService) {}

  setLoggedInStatus(status: boolean) {
    this.isLoggedInSubject.next(status);
  }

  signup(userData: FormData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap((res) => {
          if (res?.token && res?.User) this.setSession(res.token, res.User);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    console.log("API URL used:", this.baseUrl);
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          const user = res?.User;
          if (res?.token && res?.User) this.setSession(res.token, res.User);
          this.cartService.loadCartFromStorage();
        })
      );
  }

  googleAuth(): void {
    window.open(`${this.baseUrl}/auth/google`, '_self');
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== this.baseUrl) return; // تأكد من مصدر الرسالة
      if (event.data?.token && event.data?.user) {
        this.setSession(event.data.token, event.data.user);
        this.cartService.loadCartFromStorage(); // حدث السلة فورًا
        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);
  }

  private setSession(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.setLoggedInStatus(true);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    this.cartService.clearCart();
    this.setLoggedInStatus(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.getUser()?.role || null;
  }

  verifyOtp(userId: string, lastOTP: string): Observable<OtpResponse> {
    return this.http
      .post<OtpResponse>(`${this.baseUrl}/verify`, { userId, lastOTP })
      .pipe(
        tap((res) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.setLoggedInStatus(true);
          }
        })
      );
  }

  resendOtp(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp/${userId}`, {});
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forget`, { email });
  }

  resetPassword(token: string, newpassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset/${token}`, { newpassword });
  }

  updatePassword(data: {
    email: string;
    password: string;
    newpassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/update`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
