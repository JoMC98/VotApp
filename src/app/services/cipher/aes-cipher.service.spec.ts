import { TestBed } from '@angular/core/testing';

import { AESCipherService } from './aes-cipher.service';

describe('AESCipherService', () => {
  let service: AESCipherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AESCipherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
