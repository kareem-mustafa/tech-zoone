import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css'],
})
export class CategoryProductsComponent implements OnInit {
  categoryName!: string;
  products: Product[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.loading = true;
          this.categoryName = params.get('categoryName') || '';
          if (!this.categoryName) return of([] as Product[]);
          return this.productService.getAllProducts();
        })
      )
      .subscribe({
        next: (res: any) => {
          const products = Array.isArray(res) ? res : res.data ?? [];
          this.products = products.filter(
            (p: Product) => p.category?.name === this.categoryName
          );
          this.loading = false;
        },
        error: () => {
          this.products = [];
          this.loading = false;
        },
      });
  }
}
