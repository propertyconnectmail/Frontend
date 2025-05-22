import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserstateService {

  private profileImageSubject = new BehaviorSubject<string>('');
  imageUrl$ = this.profileImageSubject.asObservable();

  private loginStateSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));
  loginState$ = this.loginStateSubject.asObservable();

  setProfileImage(url: string) {
    this.profileImageSubject.next(url);
  }

  setLoginState(state: boolean) {
    this.loginStateSubject.next(state);
  }
}
