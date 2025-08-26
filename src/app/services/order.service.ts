import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from '../models/iorder';
import { Product, ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order';
  private apiUrl2 = 'http://localhost:5000';


  constructor(private http: HttpClient, private productService: ProductService) { }

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

  get orderId(): string {
    const orderStr = localStorage.getItem('order'); // 👈 غيرنا من 'user' إلى 'order'
    if (!orderStr) return '';
    try {
      const order = JSON.parse(orderStr);
      return order._id;   // أو order.id حسب اللي راجعه السيرفر
    } catch (err) {
      console.error('Error parsing order from localStorage', err);
      return '';
    }
  }


  get headers(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  addOrder(orderData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add`,
      { ...orderData, userId: this.userId },
      this.headers
    );
  }
  deleteOrder(id: string = this.orderId): Observable<any> {
    if (!id) throw new Error('Order ID not found in localStorage');
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, this.headers);
  }


  createCheckoutSession(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkout`,
      { userid: this.userId },
      this.headers
    );
  }


  getOrderById(id: string): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.apiUrl}/${id}`, this.headers);
  }
  getInvoice(orderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl2}/invoice/${orderId}/pdf`, {
      responseType: 'blob'  // هنا مش لازم as 'json'
    });
  }

getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.apiUrl, this.headers);
  }

}
