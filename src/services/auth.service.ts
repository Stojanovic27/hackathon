import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface RegisterPayload {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

// CityLocation interface should have a `city` property
export interface CityLocation {
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `/api/users`;

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  getAvailableCities(): Observable<CityLocation[]> {
    return this.http.get<{ cities: string[] }>(`/api/address/cities`).pipe(
      map(response => {
        // Map each city name to a CityLocation object
        return response.cities.map(city => ({ city }));
      })
    );
  }
}
