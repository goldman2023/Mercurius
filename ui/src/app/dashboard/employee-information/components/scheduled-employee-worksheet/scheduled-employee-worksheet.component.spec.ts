import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledEmployeeWorksheetComponent } from './scheduled-employee-worksheet.component';

describe('ScheduledEmployeeWorksheetComponent', () => {
  let component: ScheduledEmployeeWorksheetComponent;
  let fixture: ComponentFixture<ScheduledEmployeeWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledEmployeeWorksheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledEmployeeWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
