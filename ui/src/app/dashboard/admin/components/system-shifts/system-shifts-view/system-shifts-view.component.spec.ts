import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemShiftsViewComponent } from './system-shifts-view.component';

describe('SystemShiftsViewComponent', () => {
  let component: SystemShiftsViewComponent;
  let fixture: ComponentFixture<SystemShiftsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemShiftsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemShiftsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
