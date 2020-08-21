import { OrdersListService } from './../../services/orders-list.service';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(private ordersListService: OrdersListService, private datePipe: DatePipe) { }

  ngOnInit() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (cartItems != null) {
      cartItems.forEach(element => {
        this.cartItems.push(new CartItem(element.menuItem, element.quantity));
      });
    }
  }

  putQuantity(cartItem: CartItem, quantity: number) {
    // tslint:disable-next-line: triple-equals
    if (quantity == 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.cartItems.length; index++) {
        if (this.cartItems[index].menuItem.id === cartItem.menuItem.id) {
          this.cartItems[index].quantity = quantity;
        }
      }
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  getTotal() {
    if (this.cartItems != null) {
      let total = 0;
      for (const value of this.cartItems.map(x => x.menuItem.price * x.quantity)) {
        total += value;
      }
      return total;
    }
    return 0;
  }

  postOrder() {
    const order = new Order();
    order.id = this.generateUID(20);
    order.date = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS') + 'Z';
    order.userEmail = 'vinicius@tolentinos.com';
    order.value = this.getTotal();
    order.items = Object.assign({}, this.cartItems);
    // tslint:disable-next-line: only-arrow-functions
    order.items = Object.keys(order.items).map(function(key) { return order.items[key]; });
    this.ordersListService.postOrder(order).subscribe(
      () => {
        localStorage.removeItem('cartItems');
        this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
      }
    );
  }

  generateUID(lengthOfCode: number) {
    const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
