import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = `${environment.apiUrl}/appointment/`;

  constructor(private http: HttpClient) {}
  getAllAppointments() {
    return this.http.get<any>(this.apiUrl+'get/')
  }
}
