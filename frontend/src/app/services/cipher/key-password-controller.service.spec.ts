import { TestBed } from '@angular/core/testing';

import { KeyPasswordControllerService } from './key-password-controller.service';

describe('KeyPasswordControllerService', () => {
  let service: KeyPasswordControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyPasswordControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
