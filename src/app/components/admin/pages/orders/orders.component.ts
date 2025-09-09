import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/models/iorder';
import { OrderService } from '../../../../services/order.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: IOrder[] = [];
  loading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

   deleteOrder(orderId: string = this.orderService.orderId) {
  if (!orderId) return;
  this.orderService.deleteOrder(orderId).subscribe({
    next: () => {
      this.orders = this.orders.filter(o => o._id !== orderId);
      // this.serverMessage = '✅ Order deleted successfully';
      // لو عايز تعيد تحميل الأوردرات:
      this.loadOrders();
    },
    error: (err) => {
      console.error('Error deleting order:', err);
      // this.serverMessage = '❌ Failed to delete order';
    },
  });
}
}
