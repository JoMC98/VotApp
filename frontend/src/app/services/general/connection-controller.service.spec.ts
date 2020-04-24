import { TestBed } from '@angular/core/testing';

import { ConnectionControllerService } from './connection-controller.service';

describe('ConnectionControllerService', () => {
  let service: ConnectionControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
