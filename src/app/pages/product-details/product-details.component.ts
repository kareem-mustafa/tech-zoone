import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product | null;
  loading = true;
  errorMessage = '';
  wishlist: Product[] = [];
  rating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
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
    this.loadWishlist();
  }
  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe({
      next: (res: any[]) => {
        this.wishlist = res.map((item) => item.product);
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      },
    });
  }
  isInWishlist(productId: string): boolean {
    return this.wishlist.some((item) => item._id === productId);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.toastr.success(`${product.title} added to cart`, 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to add product to cart', 'Error');
        console.error('Error adding to cart:', err);
      },
    });
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product._id, 1).subscribe({
      next: () => {
        this.wishlist.push(product);
        this.toastr.success(`${product.title} added to wishlist`, 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to add product to wishlist', 'Error');
        console.error('Error adding to wishlist:', err);
      },
    });
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist(product._id)) {
      this.wishlistService.removeFromWishlist(product._id).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter((p) => p._id !== product._id);
          this.toastr.info(`${product.title} removed from wishlist`, 'Info');
        },
        error: (err) => {
          this.toastr.error('Failed to remove product from wishlist', 'Error');
          console.error('Error removing from wishlist:', err);
        },
      });
    } else {
      this.addToWishlist(product);
    }
  }
}