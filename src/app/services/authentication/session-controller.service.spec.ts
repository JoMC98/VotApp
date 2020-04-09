import { TestBed } from '@angular/core/testing';

import { SessionControllerService } from './session-controller.service';

describe('SessionControllerService', () => {
  let service: SessionControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
