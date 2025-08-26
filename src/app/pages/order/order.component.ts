import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../models/iorder';
import { OrderService } from '../../services/order.service';
import { IUser } from '../../models/iuser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  myOrder!: IOrder[] | undefined;
  myUser!: IUser | undefined;
  private userId: string = '';
  serverMessage: string = ''; // ✅ لعرض الرسائل

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.setUserIdFromLocalStorage();
    if (this.userId) {
      this.loadOrder();
    }
  }

  private setUserIdFromLocalStorage() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      this.userId = user._id;
    } catch (err) {
      console.error('Error parsing user from localStorage', err);
    }
  }

  loadOrder() {
    this.orderService.getOrderById(this.userId).subscribe({
      next: (data) => (this.myOrder = data),
      error: (err) => console.error('Error loading order:', err),
    });
  }

  deleteOrder(orderId: string = this.orderService.orderId) {
  if (!orderId) return;
  this.orderService.deleteOrder(orderId).subscribe({
    next: () => {
      console.log('Order deleted successfully');
      this.myOrder = undefined;
      this.serverMessage = '✅ Order deleted successfully';
      // لو عايز تعيد تحميل الأوردرات:
      this.loadOrder();
    },
    error: (err) => {
      console.error('Error deleting order:', err);
      this.serverMessage = '❌ Failed to delete order';
    },
  });
}


getInvoice(orderId: string=this.orderService.orderId) {
  if (!orderId) return;
  this.orderService.getInvoice(orderId).subscribe({
    next: (pdfBlob) => {
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL, '_blank');
    },
    error: (err) => console.error('Error fetching invoice:', err),
  });
} } 
