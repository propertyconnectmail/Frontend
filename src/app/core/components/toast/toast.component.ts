import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { Toast } from '../../interfaces/toast/toast';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  toastMessage$: Observable<Toast[]>; // Observing multiple toasts

  constructor(private toastService: ToastService) {
    this.toastMessage$ = this.toastService.toast$;
  }

  ngOnInit(): void {}

  // Method to clear a specific toast
  clearToast(toast: Toast): void {
    this.toastService.removeToast(toast);
  }
}
