import { TestBed } from '@angular/core/testing';

import { AdminSocketControllerService } from './admin-socket-controller.service';

describe('AdminSocketControllerService', () => {
  let service: AdminSocketControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSocketControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
