import { NgModule } from '@angular/core';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupUserComponent } from './pages/signup-user/signup-user.component';
import { SignupSellerComponent } from './pages/signup-seller/signup-seller.component';
import { HomeComponent } from './pages/home/home.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CategoryProductsComponent } from './pages/category-products/category-products.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AuthInterceptor } from './Interceptors/auth.interceptor';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { AddorderComponent } from './pages/addorder/addorder.component';
import { OrderComponent } from './pages/order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/Dashboards/sidenav/sidenav.component';
import { UsersComponent } from './components/admin/pages/users/users.component';
import { ProductsComponent } from './components/admin/pages/products/products.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrdersComponent } from './components/admin/pages/orders/orders.component';
import { GoogleCallbackComponent } from './components/google-callback/google-callback.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AddProductsComponent } from './components/seller/add-products/add-products.component';
import { DashboardComponent } from './components/seller/dashboard/dashboard.component';
import { ProductsComponent as SellerProductsComponent } from './components/seller/products-seller/products.component';
import { ordersComponent } from './components/seller/orders/orders.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AprovedComponent } from './components/admin/pages/aproved/aproved.component';
import { ToastrModule } from 'ngx-toastr';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { RatingComponent } from './components/rating/rating.component';
import { LoadingInterceptor } from './Interceptors/loading.interceptor';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupUserComponent,
    SignupSellerComponent,
    HomeComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HeaderComponent,
    FooterComponent,
    CategoryProductsComponent,
    ProductDetailsComponent,
    CartComponent,
    ChatbotComponent,
    AddorderComponent,
    OrderComponent,
    SidenavComponent,
    UsersComponent,
    ProductsComponent,
    OrdersComponent,
    GoogleCallbackComponent,
    ProfileComponent,
    AboutUsComponent,
    AddProductsComponent,
    DashboardComponent,
    SellerProductsComponent,
    ordersComponent,
    WishlistComponent,
    AprovedComponent,
    SellerDashboardComponent,
    RatingComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule, // مهم جداً
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
   { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
   {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
