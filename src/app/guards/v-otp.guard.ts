import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OtpGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const allowOtp = localStorage.getItem('allowOtp');
    if (allowOtp === 'true') {
      return true; // يسمح بالدخول
    } else {
      this.router.navigate(['/login']); // يرجعه للـ login
      return false;
    }
  }
}
