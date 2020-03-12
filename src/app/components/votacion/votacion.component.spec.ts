import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionComponent } from './votacion.component';

describe('VotacionComponent', () => {
  let component: VotacionComponent;
  let fixture: ComponentFixture<VotacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
