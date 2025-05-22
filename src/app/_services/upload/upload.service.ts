import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = `${environment.apiUrl}/upload/`;

  constructor(private http: HttpClient) {}

  postProfessionalFiles(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl+'certification', formData);
  }

  postImage(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl+'create', formData);
  }
  
}
