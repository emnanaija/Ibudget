import { TestBed } from '@angular/core/testing';

import { ObjectifService } from './objectif.service';

describe('ObjectifService', () => {
  let service: ObjectifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
