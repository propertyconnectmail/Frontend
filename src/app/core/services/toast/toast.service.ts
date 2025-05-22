import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../../interfaces/toast/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast[]>([]); // Use an array to store multiple toasts
  toast$ = this.toastSubject.asObservable();
  
  constructor() {}

  // Show a toast
  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const toastMessage: Toast = { message, type };
    const currentToasts = this.toastSubject.getValue();
    this.toastSubject.next([...currentToasts, toastMessage]); // Add new toast to the array

    // Automatically close the toast after 5 seconds (adjust as needed)
    setTimeout(() => {
      this.removeToast(toastMessage); // Remove the toast after 5 seconds
    }, 5000);
  }

  // Method to remove a specific toast manually
  removeToast(toast: Toast): void {
    const currentToasts = this.toastSubject.getValue();
    const filteredToasts = currentToasts.filter(t => t !== toast);
    this.toastSubject.next(filteredToasts); // Emit the updated list of toasts
  }

  // Method to clear all toasts
  clearAllToasts(): void {
    this.toastSubject.next([]); // Clear all toasts
  }
}
