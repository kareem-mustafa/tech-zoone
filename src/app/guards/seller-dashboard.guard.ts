import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SellerDashboardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    const role = this.authService.getUserRole();

    if (role === 'seller') {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}
