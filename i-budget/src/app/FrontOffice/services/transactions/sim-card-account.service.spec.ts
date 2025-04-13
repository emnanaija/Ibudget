import { TestBed } from '@angular/core/testing';

import { SimCardAccountService } from './sim-card-account.service';

describe('SimCardAccountService', () => {
  let service: SimCardAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimCardAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
