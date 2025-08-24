import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../models/iorder';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order'; // توحيد الـ endpoint

  constructor(private http: HttpClient) {}

  // الحصول على userId من localStorage
  get userId(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '';
    try {
      const user = JSON.parse(userStr);
      return user._id;
    } catch (err) {
      console.error('Error parsing user from localStorage', err);
      return '';
    }
  }

  // إضافة headers مع توكن
  get headers(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // جلب كل الطلبات
  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl, this.headers);
  }

  // حذف طلب
  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.headers);
  }

  // إضافة طلب جديد
  addOrder(orderData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      { ...orderData, userId: this.userId },
      this.headers
    );
  }

  // الحصول على طلب بواسطة Id
  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/${id}`, this.headers);
  }

  // إنشاء جلسة Checkout
  createCheckoutSession(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout`,
      { userid: this.userId },
      this.headers
    );
  }

  // تحميل الفاتورة PDF
  getInvoice(userId: string): Observable<Blob> {
    return this.http.get(`http://localhost:5000/invoice/${userId}/pdf`, {
      responseType: 'blob',
    });
  }
}
