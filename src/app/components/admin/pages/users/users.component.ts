import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any[] = [];
  loading = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.loading = false;
      }
    });
  }

deleteUser(id: string): void {
  const user = this.users.find(u => u._id === id);

  this.adminService.deleteUser(id).subscribe({
    next: () => {
      if (user) {
        user.deleteMessage = 'User deleted successfully';
        user.deleteMessageType = 'success';

        setTimeout(() => {
          // حذف العنصر بعد 3 ثواني
          this.users = this.users.filter(u => u._id !== id);
        }, 1000);
      }
    },
    error: (err) => {
      console.error('Error deleting user', err);
      if (user) {
        user.deleteMessage = 'Failed to delete user';
        user.deleteMessageType = 'error';

        setTimeout(() => {
          user.deleteMessage = '';
          user.deleteMessageType = '';
        }, 1000);
      }
    }
  });
}


  // component.ts
  //جديد
  updateUser(user: any): void {
    const { _id, username } = user;

    this.adminService.updateUser(_id, username).subscribe({
      next: (res) => {
        this.users = this.users.map(u => u._id === _id ? { ...u, username } : u);

        const updatedUsers = this.users.map(u => {
          if (u._id === _id) {
            return { ...u, message: 'User updated successfully', messageType: 'success' };
          }
          return u;
        });
        this.users = updatedUsers;

        setTimeout(() => {
          const clearedUsers = this.users.map(u => {
            if (u._id === _id) {
              return { ...u, message: '', messageType: '' };
            }
            return u;
          });
          this.users = clearedUsers;
        }, 1000);
      },
      error: (err) => {
        console.error('Error updating user', err);

        const updatedUsers = this.users.map(u => {
          if (u._id === _id) {
            return { ...u, message: 'Failed to update user', messageType: 'error' };
          }
          return u;
        });
        this.users = updatedUsers;

        setTimeout(() => {
          const clearedUsers = this.users.map(u => {
            if (u._id === _id) {
              return { ...u, message: '', messageType: '' };
            }
            return u;
          });
          this.users = clearedUsers;
        }, 1000);
      }
    });
  }

}