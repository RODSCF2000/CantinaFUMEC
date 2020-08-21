import { Category } from './../models/category';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const URL = environment.api;

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(URL + '/category');
  }

  getCategoriesByCardTitle(cardTitle: string, id: number): Observable<Category[]> {
    return this.http.get<Category[]>(URL + '/category/?cardTitle=' + cardTitle + '&id_ne=' + id);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(URL + '/category/' + id);
  }

  postCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(URL + '/category', category);
  }

  putCategory(category: Category): Observable<any> {
    return this.http.put<any>(URL + '/category/' + category.id, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(URL + '/category/' + id);
  }
}
