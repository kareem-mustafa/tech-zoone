import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/models/iorder';
import { OrderService } from 'src/app/services/order.service';
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

  deleteOrder(id: string) {
    if(confirm("Are You Sure To delete This Order")) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o._id !== id);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
