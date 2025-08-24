import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/models/iorder';
import { SellerDashboardService } from '../../../services/seller-dashboard.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class ordersComponent implements OnInit {
  constructor(private sellerDashboardService: SellerDashboardService) {}

  orders: IOrder[] = [];

  ngOnInit(): void {
    this.sellerDashboardService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders as IOrder[];
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }
}
