import { TestBed } from '@angular/core/testing';

import { DatosVotacionControllerService } from './datos-votacion-controller.service';

describe('DatosVotacionControllerService', () => {
  let service: DatosVotacionControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosVotacionControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
