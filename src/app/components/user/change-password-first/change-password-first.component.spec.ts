import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordFirstComponent } from './change-password-first.component';

describe('ChangePasswordFirstComponent', () => {
  let component: ChangePasswordFirstComponent;
  let fixture: ComponentFixture<ChangePasswordFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
