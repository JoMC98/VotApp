import { TestBed } from '@angular/core/testing';

import { KeyGeneratorService } from './key-generator.service';

describe('KeyGeneratorService', () => {
  let service: KeyGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
