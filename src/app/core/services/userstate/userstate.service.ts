import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserstateService {

  constructor() { }

  private profileImageSubject = new BehaviorSubject<string>('');
  imageUrl$ = this.profileImageSubject.asObservable();

  setProfileImage(url: string) {
    this.profileImageSubject.next(url);
  }
}
