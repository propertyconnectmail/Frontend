import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { operationsGuard } from './operations.guard';

describe('operationsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => operationsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
