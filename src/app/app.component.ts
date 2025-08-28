import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  showLayout = true;

  constructor(private router: Router, private cartService: CartService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const noLayoutRoutes = [
          '/login',
          '/signup-user',
          '/signup-seller',
          '/forgot-password',
          '/reset-password',
          '/verify-otp',
        ];
        this.showLayout = !noLayoutRoutes.some((path) =>
          event.url.startsWith(path)
        );
      });
  }
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe();
  }
}
