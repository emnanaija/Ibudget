import { TestBed } from '@angular/core/testing';

import { ConnexionInfoService } from './connexion-info.service';

describe('ConnexionInfoService', () => {
  let service: ConnexionInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnexionInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
