import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemShiftsComponent } from './system-shifts.component';

describe('SystemShiftsComponent', () => {
  let component: SystemShiftsComponent;
  let fixture: ComponentFixture<SystemShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemShiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
