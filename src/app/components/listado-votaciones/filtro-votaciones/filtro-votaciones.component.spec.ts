import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroVotacionesComponent } from './filtro-votaciones.component';

describe('FiltroVotacionesComponent', () => {
  let component: FiltroVotacionesComponent;
  let fixture: ComponentFixture<FiltroVotacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroVotacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroVotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
