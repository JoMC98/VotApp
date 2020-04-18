import { TestBed } from '@angular/core/testing';

import { ListaDepartamentosService } from './lista-departamentos.service';

describe('ListaDepartamentosService', () => {
  let service: ListaDepartamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaDepartamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
