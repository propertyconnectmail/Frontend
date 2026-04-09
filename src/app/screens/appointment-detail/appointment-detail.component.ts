import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppointmentService } from '../../_services/appointment/appointment.service';
import { ProfessionalService } from '../../_services/professional/professional.service';
import { ClientService } from '../../_services/client/client.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-appointment-detail',
  standalone: false,
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.scss'
})
export class AppointmentDetailComponent implements OnInit {
  mode: string = '';
  appointmentId: string = '';
  isLoading = true;

  appointment: any = null;
  client: any = null;
  professional: any = null;

  // Modal state
  showComplaintModal = false;
  newComplaintStatus: string = '';
  adminNotes: string = '';
  isUpdating = false;

  availableStatuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Reviewing', value: 'reviewing' },
    { label: 'Resolved', value: 'resolved' }
  ];

  complaintTypeLabels: { [key: string]: string } = {
    'service': 'Service Quality',
    'behavior': 'Behavior',
    'communication': 'Communication Issues',
    'technical': 'Technical Issues',
    'payment': 'Payment Issues',
    'no_show': 'No Show',
    'other': 'Other'
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private appointmentService: AppointmentService,
    private professionalService: ProfessionalService,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode') || 'view';
      this.appointmentId = params.get('id') || '';
      
      if (this.appointmentId) {
        this.loadAppointment();
      }
    });
  }

  loadAppointment(): void {
    this.isLoading = true;

    // Pass appointmentId directly as a string, not as an object
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe(
      (res: any) => {
        console.log('Appointment loaded:', res);
        this.appointment = res;
        
        // Load client details
        if (res.clientEmail) {
          this.clientService.getClientForm({ email: res.clientEmail }).subscribe(
            (client: any) => {
              this.client = client;
            }
          );
        }

        // Load professional details
        if (res.professionalEmail) {
          this.professionalService.getProfessionalForm({ email: res.professionalEmail }).subscribe(
            (professional: any) => {
              this.professional = professional;
            }
          );
        }

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      (error) => {
        console.error('Error loading appointment:', error);
        this.toastService.showToast('Failed to load appointment details', 'error');
        this.isLoading = false;
      }
    );
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'under_review': return 'Under Review';
      default: return status || 'Unknown';
    }
  }

  getComplaintTypeLabel(type: string): string {
    return this.complaintTypeLabels[type] || type || 'Unknown';
  }

  getFileName(url: string): string {
    return url.split('/').pop() || 'Document';
  }

  downloadDocuments(type: 'client' | 'professional'): void {
    const docs = type === 'client' 
      ? this.appointment.clientDocuments 
      : this.appointment.professionalDocuments;

    if (!docs || docs.length === 0) return;

    const apiUrl = 'https://backendv2-gyp9.onrender.com/api/certifications/download-zip';
    const params = new URLSearchParams();
    docs.forEach((url: string) => params.append('urls', url));
    const downloadUrl = `${apiUrl}?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  }

  goBack(): void {
    this.location.back();
  }

  // Complaint Modal Methods
  openComplaintModal(): void {
    this.newComplaintStatus = '';
    this.adminNotes = '';
    this.showComplaintModal = true;
  }

  closeComplaintModal(): void {
    this.showComplaintModal = false;
    this.newComplaintStatus = '';
    this.adminNotes = '';
  }

  selectNewStatus(status: string): void {
    if (this.canTransitionTo(status)) {
      this.newComplaintStatus = status;
    }
  }

  canTransitionTo(status: string): boolean {
    if (!this.appointment) return false;
    
    const currentStatus = this.appointment.complaintStatus;
    
    if (currentStatus === 'resolved') return false;
    if (currentStatus === 'reviewing' && status === 'pending') return false;
    if (currentStatus === status) return false;
    
    return true;
  }

  updateComplaintStatus(): void {
    if (!this.appointment || !this.newComplaintStatus) return;

    this.isUpdating = true;

    const updateData = {
      appointmentId: this.appointment.appointmentId,
      complaintStatus: this.newComplaintStatus,
      adminNotes: this.adminNotes
    };

    this.appointmentService.updateComplaintStatus(updateData).subscribe(
      (res: any) => {
        if (res.message === 'success') {
          this.toastService.showToast('Complaint status updated successfully', 'success');
          this.closeComplaintModal();
          this.loadAppointment(); // Refresh
        } else {
          this.toastService.showToast('Failed to update complaint status', 'error');
        }
        this.isUpdating = false;
      },
      (error) => {
        console.error('Error updating complaint status:', error);
        this.toastService.showToast('Failed to update complaint status', 'error');
        this.isUpdating = false;
      }
    );
  }
}