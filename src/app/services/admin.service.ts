import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // اضفت HttpHeaders لو احتجت Authorization
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  // ===================== Products =====================
  getProducts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product/${id}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/product`, data);
  }

  updateProduct(oldSlug: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/product/${oldSlug}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/product/${id}`);
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

  // ===================== Orders =====================
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

  approveSeller(sellerId: string) {
    return this.http.put(`http://localhost:5000/user/approve-seller/${sellerId}`, {});
  }
}
