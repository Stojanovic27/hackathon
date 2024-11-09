import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

// Expanded CityLocation interface to match new API response structure
export interface CityLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Define the payload structure for the /dispatcher endpoint
export interface DispatchPayload {
  load_address: {
    city: string;
    country: string;
  };
  unload_address: {
    city: string;
    country: string;
  };
  price: number;
}

// Define the response structure for the /dispatcher endpoint
export interface DispatchResponse {
  reason_why_you_choose_this_partner: string;
  direct_message: string;
  // conversation_id: string;
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
    return this.http.get<CityLocation[]>(`/dispatcher/cities`).pipe(
      map(response => {
        // Map each item in response to ensure it matches CityLocation interface if needed
        console.log("response", response);
        
        return response.map(cityData => ({
          city: cityData.city,
          country: cityData.country,
          latitude: cityData.latitude,
          longitude: cityData.longitude
        }));
      })
    );
  }

  // Method to call the /dispatcher POST API
  dispatch(payload: DispatchPayload): Observable<DispatchResponse> {
    return this.http.post<DispatchResponse>('/dispatcher', payload).pipe(
      catchError(error => {
        // Handle errors here
        console.error('Error dispatching:', error);
        return [];
      })
    );
  }

  sendMessage(message: string, conversation_id: string): Observable<any> {
    return this.http.post(`/dispatcher/${conversation_id}/send_message`, { message });
  }
}
