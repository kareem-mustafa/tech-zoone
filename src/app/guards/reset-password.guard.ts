import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.paramMap.get('token');

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
