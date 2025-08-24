import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userData = this.authService.getUser();
    if (userData && userData.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
