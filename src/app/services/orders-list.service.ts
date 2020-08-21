import { Order } from './../models/order';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const URL = environment.api;

@Injectable({
  providedIn: 'root'
})
export class OrdersListService {

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(URL + '/ordersList');
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(URL + '/ordersList/' + id);
  }

  postOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(URL + '/ordersList', order);
  }

  putOrder(order: Order): Observable<any> {
    return this.http.put<any>(URL + '/ordersList/' + order.id, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(URL + '/ordersList/' + id);
  }
}
