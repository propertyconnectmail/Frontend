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
    ])
  ]
})
export class PaymentComponent implements OnInit {
  constructor(private router: Router, private appointmentService: AppointmentService, private toastServie: ToastService) { }
    
      searchControl = new FormControl('');
    
      currentPage = 1;
      pageSize = 10;
      isLoading = true;
      loading = false;
      initialLoad = true;
    
      columns: any[] = [
        { key: 'appointmentId', label: 'Appointment Id' },
        { key: 'totalPaymentAmount', label: 'Total Fee' },
        { key: 'professionalPaymentAmount', label: 'Professional Fee' },
        { key: 'commission', label: 'Commission' },
        { key: 'transactionFee', label: 'Transaction Fee' }
      ];

      // Draggable columns
      draggableColumns = [...this.columns];

      // Fetch only required appointment fields
      appointments: any[] = [];
      orginalAppointments: any[] = [];
      paginatedData: any[] = [];
          
    
    
      ngOnInit(): void {
        this.loading = true;
    
        this.loading = true;

        this.appointmentService.getAllAppointments().subscribe(async (res: any[]) => {
          if (res && res.length > 0) {
            // Extract only required properties from each appointment
            this.appointments = res.map((appt, index) => ({
              appointmentId: appt.appointmentId,
              totalPaymentAmount: appt.totalPaymentAmount,
              professionalPaymentAmount: appt.professionalPaymentAmount,
              commission: appt.commission,
              transactionFee: appt.transactionFee
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
        return str
          .split(' ') // Split the string into words
          .map(word => {
            // If the word is an acronym (all caps), return it as is
            if (word === word.toUpperCase()) {
              return word;
            }
            // Otherwise, capitalize the first letter and make the rest lowercase
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' '); // Join the words back into a single string
      }
      
    
    
    
      updatePagination(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.appointments.slice(start, end);
      }
    
      goToPage(page: number): void {
        if (page !== this.currentPage) {
          // Set loading state to true before the timeout to show shimmer
          this.loading = true;
    
          const start = (page - 1) * this.pageSize;
          const end = start + this.pageSize;
          const nextPageData = this.appointments.slice(start, end);
    
          // Simulate shimmer loading effect with a timeout
          setTimeout(() => {
            this.paginatedData = nextPageData;
            this.currentPage = page;
            // Set loading to false after data is loaded
            this.loading = false;
          }, 800); // Match shimmer duration (adjust timing as necessary)
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
        // Automatically set the first page if there's only one page
        const pages: number[] = [];
        if (this.totalPages <= 1) {
          return [1]; // Only page 1
        }
    
        // Automatically set the first page if there's only one page
        if (this.totalPages >= 1) {
          const start = Math.max(2, this.currentPage - 1);
          const end = Math.min(this.totalPages - 1, this.currentPage + 1);
    
          // Loop through the visible page range
          for (let i = start; i <= end; i++) {
            // Avoid adding the first and last pages if they are already manually included
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
