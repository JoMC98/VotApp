import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesplegableVotacionComponent } from './desplegable-votacion.component';

describe('DesplegableVotacionComponent', () => {
  let component: DesplegableVotacionComponent;
  let fixture: ComponentFixture<DesplegableVotacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesplegableVotacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesplegableVotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
