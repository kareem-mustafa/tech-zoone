import { Component, computed, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  wishlistCount: number = 0;
  cartCount = computed(() => this.cartService.cartItems().length);
  role: string | null = null;
  userId: string = '';
  categories = [
    'phone ',
    'Tablet',
    'Laptop',
    'Headphone',
    'Smartwatch',
    'TV',
    'speaker',
    'computer',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit() {
    // جلب بيانات المستخدم من localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser._id;
      this.role = parsedUser.role || null;
    }

    // استرجاع الـ wishlist count من localStorage
    const savedWishlist = localStorage.getItem('wishlistCount');
    this.wishlistCount = savedWishlist ? +savedWishlist : 0;

    // تحميل السلة من localStorage
    this.cartService.loadCartFromStorage();
  }

  logout() {
    this.authService.logout(); // دي بتمسح token + user + cartItems
    this.role = null;
    this.userId = '';
    this.wishlistCount = 0;
    this.router.navigate(['/login']);
  }

  viewCategory(cat: string) {
    this.router.navigate(['/category', cat]);
  }
}
