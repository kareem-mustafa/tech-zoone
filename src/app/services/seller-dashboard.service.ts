import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class SellerDashboardService {
  apiUrl = 'http://localhost:5000/product';
  constructor(private http: HttpClient) {}
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
  getProducts() {
    return this.http.get(`${this.apiUrl}/seller/${this.userId}`);
  }
  deleteProduct(slug: string) {
    return this.http.delete(`${this.apiUrl}/${slug}`);
  }
  updateProduct(slug: string, data: any) {
    return this.http.put<Product>(`${this.apiUrl}/${slug}`, data);
  }
  addProduct(data: FormData) {
    return this.http.post(`${this.apiUrl}`, data);
  }
  getOrders() {
    return this.http.get(`http://localhost:5000/order/seller/${this.userId}`);
  }
}
