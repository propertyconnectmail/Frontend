import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EmployeeService } from '../../_services/employee/employee.service';
import { UserstateService } from '../../core/services/userstate/userstate.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  pageTitle: string = '';
  imageUrl = "";
  name = "";
  type = "";

  constructor(private router: Router, private employeeService : EmployeeService, private cdref: ChangeDetectorRef, private userstateService : UserstateService, private authService : AuthService) {}

  ngOnInit(): void {
    
    this.authService.isLoggedIn().subscribe((isLoggedIn: any) => {
      if (isLoggedIn) {
        this.loadUserDetails();
      }
    });

    this.userstateService.imageUrl$.subscribe(newUrl => {
      if (newUrl) {
        this.imageUrl = newUrl;
      }
    });

    // React to login state
    this.userstateService.loginState$.subscribe((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        this.loadUserDetails();
      }
    });

    // Listen for route changes and update the title accordingly
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageTitle(this.router.url);
    });
  }

  loadUserDetails(): void {
    const storedUser: any = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.employeeService.getEmployeeForm({ email: user.email }).subscribe((employee: any) => {
        this.imageUrl = employee.url;
        this.name = employee.firstName + ' ' + employee.lastName;
        this.type = employee.type;
      });
    }
  }

  setProfileImage(url:string): void{
    this.imageUrl = url;
  }

  setPageTitle(url: string): void {
    // Define the route-to-title mapping
    const routeMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/professional': 'Professional Management',
      '/client': 'Client Management',
      '/employee': 'Employee Management',
      '/registry': 'Registry Location Management',
      '/official': 'Official Management',
      '/log': 'Audit Log Management',
      '/payments': 'Payment Management',
      '/review': 'reviews',
      '/settings': 'Profile Settings'
    };

    // Check if the URL starts with one of the base routes and set the title
    if (url.startsWith('/professional')) {
      this.pageTitle = 'Professional Management';
    } else if (url.startsWith('/client')) {
      this.pageTitle = 'Client Management';
    } else if (url.startsWith('/employee')) {
      this.pageTitle = 'Employee Management';
    }else if (url.startsWith('/registry')) {
      this.pageTitle = 'Registry Location Management';
    }else if (url.startsWith('/official')) {
      this.pageTitle = 'Offical Management';
    }else if (url.startsWith('/log')) {
      this.pageTitle = 'Audit Log Management';
    } else if (url.startsWith('/payments')){
      this.pageTitle = 'Payment Management';
    }else if (url.startsWith('/settings')){
      this.pageTitle = 'Profile Management';
    }else if (url.startsWith('/restricted')){
      this.pageTitle = 'Restricted Access';
    }else {
      // For exact matches, use the routeMap
      this.pageTitle = routeMap[url] || 'Dashboard'; // Default to Dashboard if no match
    }
  }
}
