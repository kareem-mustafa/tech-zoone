import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  Images: string[];
  discount?: number;
  slug: string;
  category: { id?: number; name: string };
  stock?: number;
  brand: string;
  ownerId?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private BASE_URL = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  // جلب كل المنتجات كـ مصفوفة مباشرة
  getAllProducts(): Observable<Product[]> {
    return this.http.get<any>(this.BASE_URL).pipe(
      map((res) => res.products || res.data || res) // دعم أي شكل للرد
    );
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.BASE_URL}/slug/${slug}`);
  }

  searchProducts(
    query: string,
    page?: number,
    limit?: number
  ): Observable<PaginatedProducts> {
    let params = new HttpParams().set('q', query);
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<PaginatedProducts>(`${this.BASE_URL}/search`, {
      params,
    });
  }

  filterProducts(
    filters: {
      categoryName?: string;
      title?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    page?: number,
    limit?: number
  ): Observable<PaginatedProducts> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<PaginatedProducts>(
      `${this.BASE_URL}/filter/category`,
      { params }
    );
  }

  sortProducts(
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    page?: number,
    limit?: number
  ): Observable<PaginatedProducts> {
    let params = new HttpParams().set('sortBy', sortBy).set('sort', sortOrder);
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<PaginatedProducts>(`${this.BASE_URL}/sort`, {
      params,
    });
  }

  // حذف منتج
  deleteProduct(slug: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${slug}`);
  }
}
