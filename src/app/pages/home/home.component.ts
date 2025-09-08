import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categoryProducts: { [key: string]: Product[] } = {};
  categories: string[] = [];
  rating: number = 0;

  wishlist: Product[] = [];
  cart: Product[] = [];

  searchQuery = '';
  filterForm!: FormGroup;

  sortByOptions = ['title', 'price'];
  sortOrderOptions = ['asc', 'desc'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      category: [''],
      minPrice: [''],
      maxPrice: [''],
      sortBy: [''],
      sortOrder: [''],
    });

    this.loadProducts();
    this.loadWishlist();
 const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userStr = params.get('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      this.authService.setSession(token, user);

      // إزالة queryParams من URL بعد الحفظ
      window.history.replaceState({}, document.title, '/home');
    } catch (err) {
      console.error('Error parsing Google user:', err);
    }
  }
  }
  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe({
      next: (res: any[]) => {
        this.wishlist = res.map((item) => item.product);
      },
      error: (err) => {
        this.toastr.error('Failed to load wishlist', 'Error');
        console.error('Error loading wishlist:', err);
      },
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
        this.filteredProducts = [...this.products];
        this.updateCategories();
      },
      error: (err) => {
        this.toastr.error('Failed to load products', 'Error');
        console.error('Error loading products:', err);
      },
    });
  }

  updateCategories() {
    this.categories = [
      ...new Set(
        this.filteredProducts.map((p) => p.category?.name || 'Unknown')
      ),
    ];

    this.categoryProducts = {};
    this.categories.forEach((cat) => {
      this.categoryProducts[cat] = this.filteredProducts.filter(
        (p) => p.category?.name === cat
      );
    });
  }

  searchProducts() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = query
      ? this.products.filter((p) => p.title.toLowerCase().includes(query))
      : [...this.products];
    this.updateCategories();

    if (query) {
      this.toastr.info('Search applied', 'Search');
    }
  }

  applyFilter() {
    const { category, minPrice, maxPrice, sortBy, sortOrder } =
      this.filterForm.value;
    let result = [...this.products];

    if (category) result = result.filter((p) => p.category?.name === category);
    if (minPrice) result = result.filter((p) => p.price >= +minPrice);
    if (maxPrice) result = result.filter((p) => p.price <= +maxPrice);

    if (sortBy) {
      result.sort((a, b) => {
        const valA: any = a[sortBy as keyof Product];
        const valB: any = b[sortBy as keyof Product];
        return sortOrder === 'desc'
          ? valB > valA
            ? 1
            : -1
          : valA > valB
          ? 1
          : -1;
      });
    }

    this.filteredProducts = result;
    this.updateCategories();
    this.toastr.info('Filters applied', 'Filter');
  }

  resetFilter() {
    this.filterForm.reset();
    this.filteredProducts = [...this.products];
    this.updateCategories();
    this.toastr.warning('Filters reset', 'Reset');
  }

  getChunks(arr: Product[], size: number) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push({ start: i, end: i + size });
    }
    return chunks;
  }

  scrollLeft(slider: HTMLElement) {
    slider.scrollBy({ left: -240, behavior: 'smooth' });
  }

  scrollRight(slider: HTMLElement) {
    slider.scrollBy({ left: 240, behavior: 'smooth' });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist?.some((item) => item?._id === productId) ?? false;
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

  viewProduct(product: Product) {
    this.router.navigate(['/products', product.slug]);
  }

  viewAllCategory(cat: string) {
    this.router.navigate(['/category', cat]);
  }

  logout() {
    this.authService.logout();
    this.toastr.info('Logged out successfully', 'Logout');
    this.router.navigate(['/login']);
  }
}
