import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectedEmployeeSummaryComponent } from './view-selected-employee-summary.component';

describe('ViewSelectedEmployeeSummaryComponent', () => {
  let component: ViewSelectedEmployeeSummaryComponent;
  let fixture: ComponentFixture<ViewSelectedEmployeeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectedEmployeeSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectedEmployeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
