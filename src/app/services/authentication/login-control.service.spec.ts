import { TestBed } from '@angular/core/testing';

import { LoginControlService } from './login-control.service';

describe('LoginControlService', () => {
  let service: LoginControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
