import { TestBed } from '@angular/core/testing';

import { CifradoControllerService } from './cifrado-controller.service';

describe('CifradoControllerService', () => {
  let service: CifradoControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CifradoControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
