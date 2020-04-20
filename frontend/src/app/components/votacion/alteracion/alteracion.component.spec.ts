import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteracionComponent } from './alteracion.component';

describe('AlteracionComponent', () => {
  let component: AlteracionComponent;
  let fixture: ComponentFixture<AlteracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlteracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlteracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
