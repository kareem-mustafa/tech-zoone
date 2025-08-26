import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupUserComponent } from './pages/signup-user/signup-user.component';
import { SignupSellerComponent } from './pages/signup-seller/signup-seller.component';
import { HomeComponent } from './pages/home/home.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/reverse-auth.guard';
import { CategoryProductsComponent } from './pages/category-products/category-products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/order/order.component';
import { AddorderComponent } from './pages/addorder/addorder.component';
import { AdminGuard } from './guards/admin.guard';
import { UsersComponent } from './components/admin/pages/users/users.component';
import { ProductsComponent } from './components/admin/pages/products/products.component';
import { OrdersComponent } from './components/admin/pages/orders/orders.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { DashboardComponent } from './components/seller/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/Dashboards/admin-dashboard/admin-dashboard.component';
import { AprovedComponent } from './components/admin/pages/aproved/aproved.component';
import { OtpGuard } from './guards/v-otp.guard';
import { SellerDashboardGuard } from './guards/seller-dashboard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup-user',
    component: SignupUserComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup-seller',
    component: SignupSellerComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'verify-otp/:id',
    component: VerifyOtpComponent,
    canActivate: [OtpGuard],
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category/:categoryName',
    component: CategoryProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/:slug',
    component: ProductDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'cart/:id',
    component: CartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-order',
    component: AddorderComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'wishlist/:id',
    component: WishlistComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'seller/dashboard',
    loadChildren: () =>
      import('./seller/seller.module').then((m) => m.SellerModule),
  },

  { path: 'about', component: AboutUsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard], 
  },
  {
    path: 'admin/products',
    component: ProductsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/dashboard/approved',
    component: AprovedComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
