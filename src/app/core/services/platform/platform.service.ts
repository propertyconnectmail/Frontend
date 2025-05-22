import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  private audit = `${environment.apiUrl}/audit/`;

  private platform = `${environment.apiUrl}/platform/`;

  constructor(private http: HttpClient) {}

  getPlatformConfig(body: any) {
    return this.http.post<any>(this.platform + 'get', body);
  }

  updateTotalProfessionals() {
    return this.http.post<any>(this.platform + 'update/professional', null);
  }

  updateTotalClients() {
    return this.http.post<any>(this.platform + 'update/client', null);
  }

  updateTotalAppointments(data: any) {
    return this.http.post<any>(this.platform + 'update/appointment', null);
  }

  updateMaintenanceMode(data: any) {
    return this.http.post<any>(this.platform + 'update/maintainance', data);
  }

  createAuditLog(data: any) {
    return this.http.post<any>(this.audit + 'create', data);
  }

  getAuditLogs() {
    return this.http.get<any>(this.audit + 'get/all');
  }
}
