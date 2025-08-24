import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { cartitems } from '../../services/cart.service';
import { wishlistItems, WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  wishlistItems: wishlistItems[] = [];

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlistItems().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
        this.wishlistItems = res;
      } else {
        this.wishlistItems = [];
      }
    },
      error: (err) => console.error('Error loading wishlist items:', err),
    });
  }

  removeFromWishlist(product: string): void {
    this.wishlistService.removeFromWishlist(product).subscribe({
      next: () => this.loadWishlist(),
      error: (err) => console.error('Error removing item:', err),
    });
  }
  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe({
      next: () => (this.wishlistItems = []),
      error: (err) => console.error('Error clearing wishlist:', err),
    });
  }


  }


