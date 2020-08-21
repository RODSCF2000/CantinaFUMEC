import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
const URL = environment.api;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  login(values: {email: string, password: string}): Observable<User[]> {
    return this.http.get<User[]>(URL + '/users/?email=' + values.email);
  }

  clear() {
    localStorage.clear();
  }

  isLogged() {
    return (localStorage.getItem('user') !== null ? true : false);
  }

  logout() {
    this.clear();
    this.router.navigate(['/login']);
  }
}
