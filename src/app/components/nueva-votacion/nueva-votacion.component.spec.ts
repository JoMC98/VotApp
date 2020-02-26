import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaVotacionComponent } from './nueva-votacion.component';

describe('NuevaVotacionComponent', () => {
  let component: NuevaVotacionComponent;
  let fixture: ComponentFixture<NuevaVotacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaVotacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaVotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
