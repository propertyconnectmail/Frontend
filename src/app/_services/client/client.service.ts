import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${environment.apiUrl}/client/`;

  constructor(private http: HttpClient) {}

  postClientForm(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'register', clientForm)
  }

  getClientForm(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }

  getAllClients() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }

  updateClientForm(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'update', clientForm)
  }

  deleteClientForm(clientForm : any) {
    return this.http.post<any>(this.apiUrl+'delete', clientForm)
  }
}
