import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AppointmentService } from '../../_services/appointment/appointment.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Appointment {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  clientUrl: string;
  professionalName: string;
  professionalEmail: string;
  professionalUrl: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus: string;
  hasComplaint: boolean;
  complaintStatus?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-appointment',
  standalone: false,
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
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
export class AppointmentComponent implements OnInit {
  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 10;
  isLoading = true;
  selectedStatus = 'all';

  appointments: Appointment[] = [];
  originalAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  paginatedData: Appointment[] = [];

  statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Completed', value: 'completed' }
  ];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm: string | null) => {
      this.filterAppointments(searchTerm);
    });
  }

  loadAppointments(): void {
    this.isLoading = true;

    this.appointmentService.getAllAppointments().subscribe(
      (res: any) => {
        if (res && res.length > 0) {
          this.appointments = res;
          this.originalAppointments = [...res];
          this.applyFilters();
        } else {
          this.appointments = [];
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        this.toastService.showToast('Failed to load appointments', 'error');
        this.isLoading = false;
      }
    );
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  getStatusCount(status: string): number {
    if (status === 'all') {
      return this.originalAppointments.length;
    }
    return this.originalAppointments.filter(app => app.appointmentStatus === status).length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'under_review': return 'Under Review';
      default: return status || 'Unknown';
    }
  }

  filterAppointments(searchTerm: string | null): void {
    this.currentPage = 1;
    this.applyFilters(searchTerm);
  }

  applyFilters(searchTerm?: string | null): void {
    let filtered = [...this.originalAppointments];

    // Apply status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.appointmentStatus === this.selectedStatus);
    }

    // Apply search filter
    const search = (searchTerm ?? this.searchControl.value ?? '').toLowerCase();
    if (search) {
      filtered = filtered.filter(app =>
        app.clientName?.toLowerCase().includes(search) ||
        app.professionalName?.toLowerCase().includes(search) ||
        app.appointmentId?.toLowerCase().includes(search) ||
        app.clientEmail?.toLowerCase().includes(search) ||
        app.professionalEmail?.toLowerCase().includes(search)
      );
    }

    this.filteredAppointments = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredAppointments.slice(start, end);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.pageSize);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 1) return [];

    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== this.totalPages) {
        pages.push(i);
      }
    }
    return pages;
  }

  view(appointmentId: string): void {
    this.router.navigate(['/appointment', 'view', appointmentId]);
  }
}