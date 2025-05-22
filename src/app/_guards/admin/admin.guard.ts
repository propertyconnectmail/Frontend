import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const parsed = JSON.parse(user);

  if (parsed.type === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
