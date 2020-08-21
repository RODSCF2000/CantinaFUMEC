import { OrdersComponent } from './components/orders/orders.component';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CategoriesComponent } from './components/categories/categories.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuardGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuardGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
