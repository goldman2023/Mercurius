import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: EmpScheduleComponent;
  let fixture: ComponentFixture<EmpScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
