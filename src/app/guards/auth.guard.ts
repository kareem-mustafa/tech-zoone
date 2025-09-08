import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
  const token = route.queryParams['token'];
  const user = route.queryParams['user'];

  if (token && user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', decodeURIComponent(user));
    this.authService.setLoggedInStatus(true);

    // تنقل بدون reload
    this.router.navigate(['/home'], { replaceUrl: true });
    return false; // مهم عشان ما يكملش باقي canActivate
  }

  if (this.authService.isLoggedIn()) {
    return true;
  } else {
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
}