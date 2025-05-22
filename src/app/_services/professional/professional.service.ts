import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Professional } from '../../_interfaces/professional/professional';


@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private apiUrl = `${environment.apiUrl}/professional/`;

  constructor(private http: HttpClient) {}

  postProfessionalForm(professionalForm : Professional) {
    return this.http.post<any>(this.apiUrl+'register', professionalForm)
  }

  getProfessionalForm(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }

  getAllProfessionals() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }

  updateProfessionalForm(professionalForm : Professional) {
    return this.http.post<any>(this.apiUrl+'update', professionalForm)
  }

  deleteProfessionalForm(professionalForm : Professional) {
    return this.http.post<any>(this.apiUrl+'delete', professionalForm)
  }
}
