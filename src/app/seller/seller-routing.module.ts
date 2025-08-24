import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from '../components/seller/products/products.component';
import { AddProductsComponent } from '../components/seller/add-products/add-products.component';
import { ordersComponent } from '../components/seller/orders/orders.component';
import { DashboardComponent } from '../components/seller/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // default route
  { path: 'products', component: ProductsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-product', component: AddProductsComponent},
  { path: 'orders', component: ordersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
