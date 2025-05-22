import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('collapseToggle', [
      state('expanded', style({ width: '240px' })),
      state('collapsed', style({ width: '80px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {

  isCollapsed = false;
  contentVisible = true;

  navItems = [
    { icon: 'assets/menu/dashboard-icon.svg', label: 'Dashboard', route: '/dashboard' },
    { icon: 'assets/menu/professionals-icon.svg', label: 'Professionals', route: '/professional' },
    { icon: 'assets/menu/clients-icon.svg', label: 'Clients', route: '/client' },
    { icon: 'assets/menu/employee-icon.svg', label: 'Employees', route: '/employee' },
    { icon: 'assets/menu/registry-icon.svg', label: 'Registry Locations', route: '/registry' },
    { icon: 'assets/menu/official-icon.svg', label: 'Officials', route: '/official' },
    { icon: 'assets/menu/log-icon.svg', label: 'Logs', route: '/log' },
    // { icon: 'assets/menu/notifications-icon.svg', label: 'Notifications', route: '/notifications' },
    { icon: 'assets/menu/payments-icon.svg', label: 'Payments', route: '/payments' },
    { icon: 'assets/menu/settings-icon.svg', label: 'Settings', route: '/settings' }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      this.contentVisible = false;
    } else {
      setTimeout(() => {
        this.contentVisible = true;
      }, 300); // Match this to your CSS transition time
    }
  }
}
