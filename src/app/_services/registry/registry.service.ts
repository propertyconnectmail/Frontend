import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {

  private apiUrl = `${environment.apiUrl}/registry/`;

  constructor(private http: HttpClient) {}

  postRegistryLocationForm(registryLocationForm : any) {
    return this.http.post<any>(this.apiUrl+'register', registryLocationForm)
  }

  getRegistryLocationForm(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }

  getAllRegistryLocations() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }

  updateRegistryLocationForm(registryLocationForm : any) {
    return this.http.post<any>(this.apiUrl+'update', registryLocationForm)
  }

  deleteRegistryLocationForm(registryLocationForm : any) {
    return this.http.post<any>(this.apiUrl+'delete', registryLocationForm)
  }
}
