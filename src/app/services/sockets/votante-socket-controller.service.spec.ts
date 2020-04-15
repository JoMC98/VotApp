import { TestBed } from '@angular/core/testing';

import { VotanteSocketControllerService } from './votante-socket-controller.service';

describe('VotanteSocketControllerService', () => {
  let service: VotanteSocketControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotanteSocketControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
