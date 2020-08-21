import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories = 0;
  products = 0;
  users = 0;

  constructor(private categoriesService: CategoriesService, private usersService: UsersService) {
  }

  ngOnInit() {
    this.getCategories();
    this.getUsers();
  }

  getCategories() {
    this.products = 0;
    this.categoriesService.getCategories().subscribe(
      categories => {
        this.categories = categories.length;
        categories.forEach(cat => this.products += cat.menu.length);
      }
    );
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      users => {
        this.users = users.length;
      }
    );
  }
}
