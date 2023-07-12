import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectedVacationSlotSummaryComponent } from './view-selected-vacation-slot-summary.component';

describe('ViewSelectedVacationSlotSummaryComponent', () => {
  let component: ViewSelectedVacationSlotSummaryComponent;
  let fixture: ComponentFixture<ViewSelectedVacationSlotSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectedVacationSlotSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectedVacationSlotSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
