import { User } from 'src/app/models/user';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from './services/categories.service';
import { Observable, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  categories: number;
  products: number;
  cartItems: number;
  logged: boolean;
  loggedUser: User;

  constructor(private categoriesService: CategoriesService, public authService: AuthService) {
    this.logged = this.authService.isLogged();
    if (this.logged) {
      this.getCategories();
      this.getCartItems();
      this.getUserLogado();
      const inter = setInterval(() => {
        if (!this.authService.isLogged()) {
          clearInterval(inter);
        } else {
          this.getCategories();
          this.getCartItems();
          this.getUserLogado();
        }
      }, 1000);
    }
    setInterval(() => {
      if (this.logged !== this.authService.isLogged()) {
        this.logged = !this.logged;
        if (this.logged) {
          location.reload();
          this.getCategories();
          this.getCartItems();
          this.getUserLogado();
          const inter = setInterval(() => {
            if (!this.authService.isLogged()) {
              clearInterval(inter);
            } else {
              this.getCategories();
              this.getCartItems();
              this.getUserLogado();
            }
          }, 1000);
        }
      }
    }, 1000);
  }

  ngOnInit() {
  }

  getUserLogado() {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe(
      categories => {
        this.categories = categories.length;
        this.products = 0;
        categories.forEach(cat => this.products += cat.menu.length);
      }, () => {
        this.categories = null;
        this.products = null;
      }
    );
  }

  getCartItems() {
    const lista = JSON.parse(localStorage.getItem('cartItems'));
    this.cartItems = lista != null ? lista.length : 0;
  }
}
