import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product`);
  }

  getProductById(slug: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product/slug/${slug}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/product`, data);
  }

  updateProduct(slug: string, data: any) {
    return this.http.put<Product>(`${this.BASE_URL}/product/${slug}`, data);
  }

  deleteProduct(slug: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/product/${slug}`);
  }

  // ===================== Users =====================
  getUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/user`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/user/${id}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/user`, data);
  }

  updateUser(id: string, username: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}/user/${id}`, { username });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/user/${id}`);
  }

  approveSeller(sellerId: string) {
    return this.http.put(
      `${this.BASE_URL}/user/approve-seller/${sellerId}`,
      {}
    );
  }
  // =====================  Orders =====================
  getOrders(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/order`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/order/${id}`);
  }

  addOrder(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/order`, data);
  }

  updateOrder(id: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/order/${id}`, data);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/order/${id}`);
  }
}
