import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ProfessionalService } from '../../_services/professional/professional.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


interface Professional {
  id: number;
  fullName: string;
  status: 'Verified' | 'Blocked' | 'Pending' | 'Rejected';
  email: string;
  type: string;
  phone: string;  // Explicitly add phone field
  [key: string]: string | number; // Keep the index signature for other dynamic properties
}


@Component({
  selector: 'app-professional',
  standalone: false,
  templateUrl: './professional.component.html',
  styleUrl: './professional.component.scss',
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
export class ProfessionalComponent implements OnInit {

  constructor(private router: Router, private professionalService : ProfessionalService, private toastServie : ToastService) {}

  searchControl = new FormControl('');

  currentPage = 1;
  pageSize = 10;
  isLoading = true;
  loading = false;
  initialLoad = true;


  professionals: Professional[] = [];
  orginalProfessionals: Professional[] = [];
  paginatedData: Professional[] = [];


  ngOnInit(): void {
    this.loading = true;
    
    this.professionalService.getAllProfessionals().subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.length > 0) {

          let allProfessionals = res.map((prof: any) => {
            const { _id, firstName, lastName, ...rest } = prof;
            return {
              ...rest,
              fullName: `${firstName} ${lastName}`
            };
          });

          // Separate pending and non-pending
          const pendingProfessionals = allProfessionals.filter((p: any) => p.status?.toLowerCase() === 'pending');
          const otherProfessionals = allProfessionals.filter((p: any) => p.status?.toLowerCase() !== 'pending');


          // Merge with pending at the top
          this.professionals = [...pendingProfessionals, ...otherProfessionals];
          this.orginalProfessionals = [...this.professionals];
                    
          this.updatePagination();
    
          setTimeout(() => {
            this.isLoading = false;
            this.loading = false;
          }, 500);
        } else {
          this.professionals = [];
          this.isLoading = false;
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching professionals:', error);
        this.toastServie.showToast('Failed to load professionals', 'error');
        this.isLoading = false;
        this.loading = false;
      }
    );
  
    // Listen for changes in the search input and filter the list
    this.searchControl.valueChanges.pipe(
      debounceTime(300),  // Wait 300ms after the user stops typing
      distinctUntilChanged()  // Prevent filtering with the same search term
    ).subscribe((searchTerm: string | null) => {
      this.filterProfessionals(searchTerm);
    });
  }
  
  
  filterProfessionals(searchTerm: string | null) {
    const searchLower = searchTerm?.toLowerCase() || '';

    this.professionals = this.orginalProfessionals.filter((prof: any) => {
      const fullName = `${prof.fullName}`.toLowerCase();
      const email = `${prof.email || ''}`.toLowerCase();
      const phone = `${prof.phone || ''}`.toLowerCase();
      const type = `${prof.type || ''}`.toLowerCase();
      const status = `${prof.status || ''}`.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        type.includes(searchLower) ||
        status.includes(searchLower)
      );
    });

    this.currentPage = 1; // Reset to first page on new search
    this.updatePagination();
  }


  

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.professionals.slice(start, end);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      // Set loading state to true before the timeout to show shimmer
      this.loading = true;
  
      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;
      const nextPageData = this.professionals.slice(start, end);
  
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
    const max = Math.ceil(this.professionals.length / this.pageSize);
    if (this.currentPage < max) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.professionals.length / this.pageSize);
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
  
  
  

  columns: any[] = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'status', label: 'Status' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type'}  // Make sure phone is here if you want to display it
  ];
  
  

  // Only these will be rendered in draggable container
  draggableColumns = [...this.columns];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.draggableColumns, event.previousIndex, event.currentIndex);
  }

  get totalPagesArray() {
    const count = Math.ceil(this.professionals.length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.goToPage(1);
  }

  add(){
    this.router.navigate(['/professional','add']);
  }

  view(email: string){
    this.router.navigate(['/professional','view',email]);
  }

  edit(email: string){
    this.router.navigate(['/professional','edit',email]);
  }

  delete(email: string){
    this.router.navigate(['/professional','delete',email]);
  }

}
