import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const operationsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const parsed = JSON.parse(user);
  const allowedRoles = ['system admin', 'business admin', 'operations officer'];

  if (allowedRoles.includes(parsed.type)) {
    return true;
  }

  router.navigate(['/restricted']);
  return false;
};
