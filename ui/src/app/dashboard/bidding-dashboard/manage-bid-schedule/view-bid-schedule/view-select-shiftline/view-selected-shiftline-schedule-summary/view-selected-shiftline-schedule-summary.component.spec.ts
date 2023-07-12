import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectedShiftlineScheduleSummaryComponent } from './view-selected-shiftline-schedule-summary.component';

describe('ViewSelectedShiftlineScheduleSummaryComponent', () => {
  let component: ViewSelectedShiftlineScheduleSummaryComponent;
  let fixture: ComponentFixture<ViewSelectedShiftlineScheduleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectedShiftlineScheduleSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectedShiftlineScheduleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
