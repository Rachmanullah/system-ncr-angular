import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';


@Injectable()
export abstract class BaseApiService {

  protected apiUrl = environment.apiUrl;
  constructor(protected http: HttpClient) { }

  protected headers() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    });
  }

  protected get<T>(url: string) {
    return this.http.get<T>(url, { headers: this.headers() });
  }

  protected post<T>(url: string, body: any) {
    return this.http.post<T>(url, body, { headers: this.headers() });
  }

  protected put<T>(url: string, body: any) {
    return this.http.put<T>(url, body, { headers: this.headers() });
  }

  protected delete<T>(url: string) {
    return this.http.delete<T>(url, { headers: this.headers() });
  }
}
