import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from './product.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface cartitems {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<cartitems[]>([]);

  private baseUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient, private router: Router) {
    this.loadCartFromStorage();
  }

  get userId(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : '';
  }

  get headers() {
    return { Authorization: `${localStorage.getItem('token')}` };
  }

  loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cartItems');
    this.cartItems.set(savedCart ? JSON.parse(savedCart) : []);
  }

  clearLocalCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cartItems');
  }
  addToCart(productId: string, quantity: number): Observable<any> {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return new Observable(); // بيرجع Observable فاضي عشان الكومبوننت ميتكسرش
    }

    return this.http
      .post(
        `${this.baseUrl}/add`,
        { productId, quantity, userId: this.userId },
        { headers: this.headers }
      )
      .pipe(
        tap(() => {
          this.cartItems.update((items) => {
            const safeItems = items ?? []; // حماية
            const existing = safeItems.find((i) => i.product._id === productId);

            let newItems;
            if (existing) {
              newItems = safeItems.map((i) =>
                i.product._id === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              );
            } else {
              newItems = [
                ...safeItems,
                { product: { _id: productId } as Product, quantity },
              ];
            }

            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
          });
        })
      );
  }

  getCartItems(): Observable<{ items: cartitems[] }> {
    return this.http
      .get<{ items: cartitems[] }>(`${this.baseUrl}/${this.userId}`, {
        headers: this.headers,
      })
      .pipe(
        tap((res) => {
          this.cartItems.set(res?.items ?? []);
        })
      );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http
      .request('delete', `${this.baseUrl}/removeItem`, {
        body: { productId, userId: this.userId },
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.cartItems.update((items) =>
            items.filter((item) => item.product._id !== productId)
          );
          localStorage.setItem('cartItems', JSON.stringify(this.cartItems()));
        })
      );
  }

  clearCart(): Observable<any> {
    return this.http
      .request('delete', `${this.baseUrl}/`, {
        body: { userId: this.userId },
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.clearLocalCart();
        })
      );
  }

  updateCart(productId: string, quantity: number): Observable<any> {
    const userId = this.userId;
    return this.http
      .put(
        `${this.baseUrl}/update`,
        { productId, quantity, userId },
        { headers: this.headers }
      )
      .pipe(
        tap(() => {
          this.cartItems.update((items) => {
            const newItems = items.map((item) => {
              if (item.product._id === productId) {
                return { ...item, quantity };
              }
              return item;
            });
            localStorage.setItem('cartItems', JSON.stringify(newItems));
            return newItems;
          });
        })
      );
  }
}
