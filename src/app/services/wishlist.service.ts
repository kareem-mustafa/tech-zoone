import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from './product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
export interface wishlistItems {
  product: Product;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistItems = signal<wishlistItems[]>([]);

  private baseUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient , private router: Router) {
    this.loadWishlistFromStorage();
    }

  get userId(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : '';
  }

  get headers() {
    return { Authorization: `${localStorage.getItem('token')}` };
  }

  loadWishlistFromStorage(): void {
    const savedWishlist = localStorage.getItem('wishlistItems');
    this.wishlistItems.set(savedWishlist ? JSON.parse(savedWishlist) : []);
  }

  clearLocalWishlist(): void {
    this.wishlistItems.set([]);
    localStorage.removeItem('wishlistItems');
  }

  addToWishlist(product: string, quantity: number): Observable<any> {
     // 🔹 تحقق الأول إن المستخدم مسجل دخول
  if (!this.userId) {
    this.router.navigate(['/login']);
    return new Observable(); // بيرجع Observable فاضي عشان الكومبوننت ميتكسرش
  }
    return this.http
      .post(
        `${this.baseUrl}/add`,
        { product, quantity, userId: this.userId },
        { headers: this.headers }
      )
      .pipe(
        tap(() => {
          this.wishlistItems.update((items) => {
            const newItems = [
              ...items,
              { product: { _id: product } as Product, quantity },
            ];
            localStorage.setItem('wishlistItems', JSON.stringify(newItems));
            return newItems;
          });
        })
      );
  }

 getWishlistItems(): Observable<wishlistItems[]> {
  return this.http.get<wishlistItems[]>(
    `${this.baseUrl}/${this.userId}`,
    { headers: this.headers }
  ).pipe(tap(res => this.wishlistItems.set(res)))
}

  removeFromWishlist(product: string): Observable<any> {
    return this.http
      .request('delete', `${this.baseUrl}/remove`, {
        body: { product, userId: this.userId },
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.wishlistItems.update((items) =>
            items.filter((item) => item.product._id !== product)
          );
          localStorage.setItem('wishlistItems', JSON.stringify(this.wishlistItems()));
        })
      );
  }

  clearWishlist(): Observable<any> {
    return this.http
      .request('delete', `${this.baseUrl}/clear/${this.userId}`, {
        body: { userId: this.userId },
        headers: this.headers,
      })
      .pipe(
        tap(() => {
          this.clearLocalWishlist();
        })
      );
  }
}
