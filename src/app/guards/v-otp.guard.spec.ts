import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { vOtpGuard } from './v-otp.guard';

describe('vOtpGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => vOtpGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
