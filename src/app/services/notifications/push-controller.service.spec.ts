import { TestBed } from '@angular/core/testing';

import { PushControllerService } from './push-controller.service';

describe('PushControllerService', () => {
  let service: PushControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
