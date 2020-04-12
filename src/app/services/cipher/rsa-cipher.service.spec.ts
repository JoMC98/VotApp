import { TestBed } from '@angular/core/testing';

import { RSACipherService } from './rsa-cipher.service';

describe('RSACipherService', () => {
  let service: RSACipherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RSACipherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
