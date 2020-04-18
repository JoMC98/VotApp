import { TestBed } from '@angular/core/testing';

import { SenderMessageControllerService } from './sender-message-controller.service';

describe('SenderMessageControllerService', () => {
  let service: SenderMessageControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SenderMessageControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
