import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppointmentService } from '../../_services/appointment/appointment.service';


@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px) scale(0.95)' }))
      ])
    ])
  ]
})
export class PaymentComponent implements OnInit {
  constructor(
    private router: Router, 
    private appointmentService: AppointmentService, 
    private toastService: ToastService
  ) { }
    
  searchControl = new FormControl('');

  currentPage = 1;
  pageSize = 10;
  isLoading = true;
  loading = false;
  initialLoad = true;

  // Modal state
  isModalOpen = false;
  selectedPayment: any = null;

  // Updated columns to show who paid to whom
  columns: any[] = [
    { key: 'appointmentId', label: 'Appointment ID' },
    { key: 'clientName', label: 'Client (Payer)' },
    { key: 'professionalName', label: 'Professional (Payee)' },
    { key: 'totalPaymentAmount', label: 'Total Amount' },
    { key: 'professionalPaymentStatus', label: 'Payment Status' }
  ];

  // Draggable columns
  draggableColumns = [...this.columns];

  // Fetch full appointment data to show payment details
  appointments: any[] = [];
  orginalAppointments: any[] = [];
  paginatedData: any[] = [];
      

  ngOnInit(): void {
    this.loading = true;

    this.appointmentService.getAllAppointments().subscribe((res: any[]) => {
      if (res && res.length > 0) {
        // Store full appointment objects for modal details
        this.appointments = res.map((appt) => ({
          _id: appt._id,
          appointmentId: appt.appointmentId,
          appointmentDate: appt.appointmentDate,
          appointmentTime: appt.appointmentTime,
          appointmentStatus: appt.appointmentStatus,
          // Client (Payer) info
          clientName: appt.clientName,
          clientEmail: appt.clientEmail,
          clientUrl: appt.clientUrl || 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg',
          // Professional (Payee) info
          professionalName: appt.professionalName,
          professionalEmail: appt.professionalEmail,
          professionalUrl: appt.professionalUrl || 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg',
          // Payment details
          totalPaymentAmount: appt.totalPaymentAmount,
          professionalPaymentAmount: appt.professionalPaymentAmount,
          commission: appt.commission,
          transactionFee: appt.transactionFee,
          professionalPaymentStatus: appt.professionalPaymentStatus,
          // Timestamps
          createdAt: appt.createdAt,
          updatedAt: appt.updatedAt
        }));

        this.orginalAppointments = [...this.appointments];
        this.updatePagination();

        setTimeout(() => {
          this.isLoading = false;
          this.loading = false;
        }, 500);
      } else {
        this.appointments = [];
        this.isLoading = false;
        this.loading = false;
      }
    });
  }

  capitalizeWords(str: string): string {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => {
        if (word === word.toUpperCase()) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
  
  // Modal methods
  openPaymentModal(payment: any): void {
    this.selectedPayment = payment;
    this.isModalOpen = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPayment = null;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.appointments.slice(start, end);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      this.loading = true;

      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;
      const nextPageData = this.appointments.slice(start, end);

      setTimeout(() => {
        this.paginatedData = nextPageData;
        this.currentPage = page;
        this.loading = false;
      }, 800);
    }
  }


  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    const max = Math.ceil(this.appointments.length / this.pageSize);
    if (this.currentPage < max) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.appointments.length / this.pageSize);
  }


  get visiblePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 1) {
      return [1];
    }

    if (this.totalPages >= 1) {
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }
    }

    return pages;
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.draggableColumns, event.previousIndex, event.currentIndex);
  }

  get totalPagesArray() {
    const count = Math.ceil(this.appointments.length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.goToPage(1);
  }
}
