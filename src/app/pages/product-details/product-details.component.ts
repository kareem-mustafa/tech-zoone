import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product | null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.productService.getProductBySlug(slug).subscribe({
          next: (res) => {
            this.product = res;
            this.loading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = err.error.message || 'Product not found';
            this.loading = false;
          },
        });
      }
    });
  }
  addToCart(product: Product) {
    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        alert(`${product.title} added to cart!`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }
  toggleWishlist(product: Product) {
    alert(`${product.title} added/removed from wishlist`);
  }
}
