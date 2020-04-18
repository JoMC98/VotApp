import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoVotacionesComponent } from './listado-votaciones.component';

describe('ListadoVotacionesComponent', () => {
  let component: ListadoVotacionesComponent;
  let fixture: ComponentFixture<ListadoVotacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoVotacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoVotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
