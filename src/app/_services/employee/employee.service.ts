import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  private apiUrl = `${environment.apiUrl}/employee/`;

  constructor(private http: HttpClient) {}

  postEmployeeForm(employeeForm : any) {
    return this.http.post<any>(this.apiUrl+'register', employeeForm)
  }

  getEmployeeForm(body: any) {
    return this.http.post<any>(this.apiUrl+'get', body)
  }

  getAllEmployees() {
    return this.http.get<any>(this.apiUrl+'get/all')
  }

  updateEmployeeForm(employeeForm : any) {
    return this.http.post<any>(this.apiUrl+'update', employeeForm)
  }

  deleteEmployeeForm(employeeForm : any) {
    return this.http.post<any>(this.apiUrl+'delete', employeeForm)
  }


  updateEmployeeProfilePicture(ProfessionalForm : any) {
    return this.http.post<any>(this.apiUrl+'update/picture', ProfessionalForm)
  }

  updateEmployeePassword(passwordForm : any) {
    return this.http.post<any>(this.apiUrl+'update/pass', passwordForm)
  }
}
