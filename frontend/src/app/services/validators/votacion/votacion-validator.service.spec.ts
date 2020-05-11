import { TestBed } from '@angular/core/testing';

import { VotacionValidatorService } from './votacion-validator.service';

describe('VotacionValidatorService', () => {
  let service: VotacionValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotacionValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
