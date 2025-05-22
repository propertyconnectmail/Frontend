import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RegistryService } from '../../_services/registry/registry.service';

interface Registry {
  id:string;
  locationName: string;
  district: string;
  province:string;
  address: string;
  status: 'Verified' | 'Inactive' | 'Blocked';
  phone: string;
  [key: string]: string | number; // Keep the index signature for other dynamic properties
}

@Component({
  selector: 'app-registry',
  standalone: false,
  templateUrl: './registry.component.html',
  styleUrl: './registry.component.scss',
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
export class RegistryComponent {

  constructor(private router: Router, private registryService : RegistryService, private toastServie : ToastService) {}
  
  searchControl = new FormControl('');

  currentPage = 1;
  pageSize = 10;
  isLoading = true;
  loading = false;
  initialLoad = true;


  registryLocations: Registry[] = [];
  orginalRegistryLocations: Registry[] = [];
  paginatedData: Registry[] = [];


  ngOnInit(): void {
    this.loading = true;
    
    this.registryService.getAllRegistryLocations().subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.length > 0) {

          // Store the original list
          this.registryLocations = res.map((prof: any) => {
            const { _id, ...rest } = prof;
            return {
              ...rest
            };
          });
          
          // Initialize the registryLocations list
          this.registryLocations = [...this.registryLocations];
          this.orginalRegistryLocations = [...this.registryLocations];
          
          this.updatePagination();
    
          setTimeout(() => {
            this.isLoading = false;
            this.loading = false;
          }, 500);
        } else {
          this.registryLocations = [];
          this.isLoading = false;
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error fetching registryLocations:', error);
        this.toastServie.showToast('Failed to load registryLocations', 'error');
        this.isLoading = false;
        this.loading = false;
      }
    );
  
    // Listen for changes in the search input and filter the list
    this.searchControl.valueChanges.pipe(
      debounceTime(300),  // Wait 300ms after the user stops typing
      distinctUntilChanged()  // Prevent filtering with the same search term
    ).subscribe((searchTerm: string | null) => {
      this.filterregistryLocations(searchTerm);
    });
  }
  
  
  filterregistryLocations(searchTerm: string | null) {
    const searchLower = (searchTerm || '').toLowerCase();

    this.registryLocations = this.orginalRegistryLocations.filter((loc: any) => {
      const locationName = `${loc.locationName || ''}`.toLowerCase();
      const district = `${loc.district || ''}`.toLowerCase();
      const province = `${loc.province || ''}`.toLowerCase();

      return (
        locationName.includes(searchLower) ||
        district.includes(searchLower) ||
        province.includes(searchLower)
      );
    });

    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.registryLocations.slice(start, end);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      // Set loading state to true before the timeout to show shimmer
      this.loading = true;
  
      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;
      const nextPageData = this.registryLocations.slice(start, end);
  
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
    const max = Math.ceil(this.registryLocations.length / this.pageSize);
    if (this.currentPage < max) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.registryLocations.length / this.pageSize);
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
    { key: 'locationName', label: 'Location Name' },
    { key: 'district', label: 'District'},
    { key: 'province', label: 'Province' },
    { key: 'contactNumber', label: 'Phone' },
    { key: 'address', label: 'Address' }
  ];
  
  

  // Only these will be rendered in draggable container
  draggableColumns = [...this.columns];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.draggableColumns, event.previousIndex, event.currentIndex);
  }

  get totalPagesArray() {
    const count = Math.ceil(this.registryLocations.length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.goToPage(1);
  }

  add(){
    this.router.navigate(['/registry','add']);
  }

  view(email: string){
    this.router.navigate(['/registry','view',email]);
  }

  edit(email: string){
    this.router.navigate(['/registry','edit',email]);
  }

  delete(email: string){
    this.router.navigate(['/registry','delete',email]);
  }
}
