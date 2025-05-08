import { TestBed } from '@angular/core/testing';

import { CompteEpargneService } from './compte-epargne.service';

describe('CompteEpargneService', () => {
  let service: CompteEpargneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteEpargneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
