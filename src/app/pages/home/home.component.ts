import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from 'src/app/services/wishlist.service';

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
    private authService: AuthService
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
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((res: Product[]) => {
      this.products = res; // res هو Product[] مباشرة
      this.filteredProducts = [...this.products];
      this.updateCategories();
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
  }

  resetFilter() {
    this.filterForm.reset();
    this.filteredProducts = [...this.products];
    this.updateCategories();
  }

  getChunks(arr: Product[], size: number) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push({ start: i, end: i + size });
    }
    return chunks;
  }

  toggleWishlist(product: Product) {
    const index = this.wishlist.findIndex((p) => p._id === product._id);
    index > -1 ? this.wishlist.splice(index, 1) : this.wishlist.push(product);
  }

  isInWishlist(productId: string) {
    return this.wishlist.some((p) => p._id === productId);
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
        alert(`${product.title} added to wishlist!`);
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
      },
    });
  }

  viewProduct(product: Product) {
    this.router.navigate(['/products', product.slug]);
  }

  viewAllCategory(cat: string) {
    this.router.navigate(['/category', cat]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
