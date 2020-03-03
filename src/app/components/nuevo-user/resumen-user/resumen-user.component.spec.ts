import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenUserComponent } from './resumen-user.component';

describe('ResumenUserComponent', () => {
  let component: ResumenUserComponent;
  let fixture: ComponentFixture<ResumenUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
