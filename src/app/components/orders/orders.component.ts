import { DateTimezonePipe } from './../../pipes/date-timezone.pipe';
import { OrdersListService } from './../../services/orders-list.service';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  ordersList: Order[] = [];
  ordersListFiltered: Order[] = [];

  dateForm: FormGroup;

  constructor(private ordersListService: OrdersListService, private fb: FormBuilder) {
    this.dateForm = this.fb.group(
      {
        minDate: [''],
        maxDate: ['']
      }
    );
    this.getOrders();
  }

  ngOnInit() {

  }

  getOrders() {
    this.ordersListService.getOrders().subscribe(
      ordersList => {
        this.ordersList = ordersList;
        this.ordersListFiltered = ordersList;
      }
    );
  }

  submit() {
    if (this.dateForm.get('minDate').value === '' || this.dateForm.get('maxDate').value === '' ? true : !this.compareDate()) {
      const minDate = this.dateForm.get('minDate').value !== '' ?
      new DateTimezonePipe().transform(new Date(this.dateForm.get('minDate').value + ' 00:00:00.000')) : null;
      const maxDate = this.dateForm.get('maxDate').value !== '' ?
      new DateTimezonePipe().transform(new Date(this.dateForm.get('maxDate').value + ' 23:59:59.999')) : null;
      this.ordersListFiltered = this.ordersList.filter(x => {
        const date = new DateTimezonePipe().transform(new Date(x.date.replace('T', ' ').replace('Z', '')));
        if ((minDate != null ? minDate > date : false) || (maxDate != null ? maxDate < date : false)) {
          return false;
        } else {
          return true;
        }
      });
    }
  }

  compareDate() {
    const d1 = new Date(this.dateForm.get('minDate').value);
    const d2 = new Date(this.dateForm.get('maxDate').value);
    const same = d1.getTime() === d2.getTime();
    if (same) { return true; }
    if (d1 < d2) { return true; }
    return false;
  }
}
