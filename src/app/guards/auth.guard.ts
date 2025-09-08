import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // التحقق فقط من وجود token في localStorage
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // إعادة التوجيه للـ login
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}
