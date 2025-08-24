// google-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-callback',
  template: `<p>Logging in...</p>`,
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const user = params['user'] ? JSON.parse(params['user']) : null;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.setLoggedInStatus(true);
        this.router.navigate(['/home']); // بعد تسجيل الدخول
      } else {
        this.router.navigate(['/login']); // فشل تسجيل الدخول
      }
    });
  }
}
