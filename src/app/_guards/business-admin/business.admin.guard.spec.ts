import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { businessAdminGuard } from '../business-admin/business.admin.guard';

describe('businessAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => businessAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
