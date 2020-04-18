import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroUsersComponent } from './filtro-users.component';

describe('FiltroUsersComponent', () => {
  let component: FiltroUsersComponent;
  let fixture: ComponentFixture<FiltroUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
