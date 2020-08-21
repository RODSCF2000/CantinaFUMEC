import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './../models/user';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
const URL = environment.api;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(URL + '/users');
  }

  getUsersByEmail(email: string, id: number): Observable<User[]> {
    return this.http.get<User[]>(URL + '/users/?email=' + email + '&id_ne=' + id);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(URL + '/users/' + id);
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(URL + '/users', user);
  }

  putUser(user: User): Observable<any> {
    return this.http.put<any>(URL + '/users/' + user.id, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(URL + '/users/' + id);
  }
}
