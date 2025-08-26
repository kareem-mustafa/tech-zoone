import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CartService } from 'src/app/services/cart.service';
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
  wishlist: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
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
        alert(`${product.title} added to cart!`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      },
    });
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product._id, 1).subscribe({
      next: () => {
        this.wishlist.push(product);
        alert(`${product.title} added to wishlist!`);
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
      },
    });
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist(product._id)) {
      this.wishlistService.removeFromWishlist(product._id).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter((p) => p._id !== product._id);
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
        },
      });
    } else {
      this.addToWishlist(product);
    }
  }
}
