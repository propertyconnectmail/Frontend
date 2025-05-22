import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../../core/services/auth/auth.service';
import { AppComponent } from '../../app.component';
import { PlatformService } from '../../core/services/platform/platform.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('bounceOnTap', [
      transition('* => *', [
        style({ transform: 'scale(0.97)' }),
        animate('200ms ease-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('fadeBounceAnimation', [
      transition(':enter', [
        query(
          '.activity-card',
          [
            style({ opacity: 0, transform: 'scale(0.95)' }),
            stagger(50, [
              animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class DashboardComponent {

  constructor(private authService: AuthService, private appComponent: AppComponent, private platformService : PlatformService, private router: Router) {}
  
  loadingPlatformConfig = true;
  
  analyticsCards = [
    { icon: 'assets/icons/appointment-analytics.svg', title: 'Total Appointments', value: '120' },
    { icon: 'assets/icons/professional-analytics.svg', title: 'Total Professionals', value: '78' },
    { icon: 'assets/icons/client-analytics.svg', title: 'Total Clients', value: '302' },
    { icon: 'assets/icons/revenue-analytics.svg', title: 'Total Revenue', value: '$12,450' }
  ];

  fullActivityFeed: any[] = [];
  paginatedActivity: any[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  loading = false;
  initialLoad = true;
  staticTrigger = 'enter'


  ngOnInit(): void {
    this.loading = true;

    this.platformService.getPlatformConfig({id:"1"}).subscribe(async(stats) =>{

      this.analyticsCards = [
        {
          icon: 'assets/icons/appointment-analytics.svg',
          title: 'Total Appointments',
          value: stats.totalAppointments
        },
        {
          icon: 'assets/icons/professional-analytics.svg',
          title: 'Total Professionals',
          value: stats.totalProfessionals
        },
        {
          icon: 'assets/icons/client-analytics.svg',
          title: 'Total Clients',
          value: stats.totalClients
        },
        {
          icon: 'assets/icons/revenue-analytics.svg',
          title: 'Total Revenue',
          value: stats.totalRevenue
        }
      ];
      this.loadingPlatformConfig = false;
    })


    // Fetch audit logs
    this.platformService.getAuditLogs().subscribe(audits => {
      this.fullActivityFeed = audits || [];
      console.log(audits)

      setTimeout(() => {
        this.updatePagination();
        this.initialLoad = false;
        this.loading = false;
      }, 500);
    });
       
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedActivity = this.fullActivityFeed.slice(start, end);
  }

  goToPage(page: number): void {
    if (page !== this.currentPage) {
      this.loading = true;
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const nextPageData = this.fullActivityFeed.slice(start, end);

      setTimeout(() => {
        this.paginatedActivity = nextPageData;
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
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.fullActivityFeed.length / this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 1) return [1];

    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== this.totalPages) {
        pages.push(i);
      }
    }

    return pages;
  }

  onCardClick(card: any): void {
    console.log('Card clicked:', card.title);
  }

  goToLogs(){
    this.router.navigate(['/log']);
  }
}
