import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  const expectedRoles = route.data?.['roles'] as string[];

  if (!role || (expectedRoles && !expectedRoles.includes(role))) {
    return router.parseUrl('/login'); // ou '/unauthorized'
  }

  return true;
};
