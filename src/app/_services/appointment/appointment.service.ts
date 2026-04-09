import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = `${environment.apiUrl}/appointment/`;

  constructor(private http: HttpClient) {}

  // Get all appointments (for admin)
  getAllAppointments() {
    return this.http.get<any>(this.apiUrl + 'all');
  }

  // Get single appointment by ID
  getAppointmentById(appointmentId: string) {
    return this.http.get<any>(this.apiUrl + 'get/' + appointmentId);
  }

  // Get all appointments with complaints
  getComplaintAppointments() {
    return this.http.get<any>(this.apiUrl + 'complaints');
  }

  // Update complaint status
  updateComplaintStatus(body: any) {
    return this.http.post<any>(this.apiUrl + 'complaint/update-status', body);
  }
}
