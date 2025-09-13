import {
  Component,
  computed,
  effect,
  OnInit,
  HostListener,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Signal للسلة
cartCount = computed(() => this.cartService.cartItems()?.length ?? 0);

  // Signal للـ wishlist عبر الـ service
  wishlistCount = computed(() => this.wishlistService.wishlistItems()?.length ?? 0);

  role: string | null = null;
  userId: string = '';
  isApproved: boolean = false;

  categories = [
    'phone',
    'Tablet',
    'Laptop',
    'Headphone',
    'Smartwatch',
    'TV',
    'speaker',
    'computer',
  ];

  mobileMenuOpen = false;
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public cartService: CartService,
    public wishlistService: WishlistService
  ) {
  }
  ngOnInit() {
    // جلب بيانات المستخدم
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser._id;
      this.role = parsedUser.role || null;
      this.isApproved = parsedUser.isApproved;
    }

    // تحميل wishlist من الـ service
    this.wishlistService.loadWishlistFromStorage();

    // تحميل السلة
    this.cartService.loadCartFromStorage();
  }
  // ======== Wishlist Methods ========
  addToWishlist(productId: string, quantity: number = 1) {
    // الاشتراك فورًا لتحديث الـ signal
    this.wishlistService.addToWishlist(productId, quantity).subscribe();
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe();
  }

  clearWishlist() {
    this.wishlistService.clearWishlist().subscribe();
  }
addToCart(productId: string, quantity: number = 1) {
    // الاشتراك فورًا لتحديث الـ signal
    this.cartService.addToCart(productId, quantity).subscribe();
  }
  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe();
  }
  clearCart() {
    this.cartService.clearCart().subscribe();
  }
  // ======== Logout ========
  logout() {
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ======== Category Navigation ========
  viewCategory(cat: string) {
    this.router.navigate(['/category', cat]);
  }

  // ======== Mobile Menu ========
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.dropdownOpen = false;
  }

  // ======== Dropdown ========
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.dropdownOpen = false;
  }
  loginSuccess() {
    this.wishlistService.loadWishlistFromStorage();
    this.cartService.loadCartFromStorage();
  }
}
