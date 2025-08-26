import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-aproved',
  templateUrl: './aproved.component.html',
  styleUrls: ['./aproved.component.css'],
})
export class AprovedComponent {
  sellers: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((res: any) => {
      this.sellers = res.filter((user: any) => user.role === 'seller');
    });
  }
  loadSellers() {
    this.adminService.getUsers().subscribe((res: any) => {
      this.sellers = res.filter((user: any) => user.role === 'seller');
    });
  }

  approveSeller(id: string) {
    this.adminService.approveSeller(id).subscribe(() => {
      alert('Seller approved ');
      this.loadSellers();
    });
  }
}
