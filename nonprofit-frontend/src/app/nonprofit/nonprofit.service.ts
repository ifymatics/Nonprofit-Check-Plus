import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NonprofitService {
  private readonly API_URL = 'http://localhost:3000/api/nonprofits';

  constructor(private http: HttpClient) {}

  // searchByEin(ein: string): Observable<any> {
  //   return this.http.get(`${this.API_URL}/search/ein/${ein}`);
  // }
  searchByEin(ein: string): Observable<any> {
    console.log(this.API_URL);
    return this.http
      .get(`${this.API_URL}/search/ein/${ein}`)
      .pipe(debounceTime(300), distinctUntilChanged());
  }

  searchByName(name: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search/name/${name}`);
  }

  getSearchHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/history`);
  }

  saveSearch(query: string, type: string): Observable<any> {
    return this.http.post(`${this.API_URL}/history`, { query, type });
  }
}
