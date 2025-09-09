import { Component, OnInit } from '@angular/core';
import { CartService, cartitems } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: cartitems[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

loadCart(): void {
  this.cartService.getCartItems().subscribe({
    next: (res) => {
      setTimeout(() => {
        if (Array.isArray(res.items)) {
          this.cartItems = res.items;
        } else {
          this.cartItems = [];
        }
      }, 0); // 0ms بس بتخلي التحديث يحصل بعد دورة التغيير الحالية
    },
    error: (err) => console.error('Error loading cart items:', err),
  });
}

  increaseQuantity(item: cartitems): void {
    const newQty = item.quantity + 1;
    this.cartService.updateCart(item.product._id, newQty).subscribe({
      next: () => (item.quantity = newQty),
      error: (err) => console.error('Error increasing quantity:', err),
    });
  }

  decreaseQuantity(item: cartitems): void {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    this.cartService.updateCart(item.product._id, newQty).subscribe({
      next: () => (item.quantity = newQty),
      error: (err) => console.error('Error decreasing quantity:', err),
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error removing item:', err),
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => (this.cartItems = []),
      error: (err) => console.error('Error clearing cart:', err),
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  goToOrders() {
    if (this.cartItems.length === 0) {
      this.toastr.error('Your cart is empty');
      return;
    }

    this.router.navigate(['/add-order']);
  }
}
