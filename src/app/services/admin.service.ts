import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL = 'http://localhost:5000'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/product/${id}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/product`, data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/product/${id}`, data);
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

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/user/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/user/${id}`);
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


