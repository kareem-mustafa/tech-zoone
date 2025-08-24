import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css'],
})
export class AddorderComponent {
  orderData = {
    fullName: '',
    address: '',
    city: '',
    phone: '',
    paymentMethodType: 'cash',
  };

  constructor(private orderService: OrderService, private router: Router) {}

  orderCreated: boolean = false; // default false

  onSubmit() {
    this.orderService.addOrder(this.orderData).subscribe({
      next: (res: any) => {
        this.serverMessage = 'Order added successfully!';
        console.log('Order Response:', res);
        this.orderCreated = true; // ✅ الأوردر اتعمل
      },
      error: (err: any) => {
        this.serverMessage = err.error?.message || 'Failed to add order!';
        this.orderCreated = false;
      },
    });
  }

  serverMessage: string = '';

  payOrder() {
    this.orderService.createCheckoutSession().subscribe({
      next: (sessionRes: any) => {
        console.log('Checkout Session:', sessionRes);

        if (sessionRes.url) {
          window.open(sessionRes.url, '_blank');
          this.serverMessage = 'Redirecting to payment...';
        } else {
          this.serverMessage =
            sessionRes.message || 'Checkout session URL not found!';
        }
      },
      error: (err) => {
        this.serverMessage =
          err.error?.message || 'Failed to start checkout session!';
      },
    });
  }

  goToOrders() {
    this.router.navigate(['/order']);
  }
}
