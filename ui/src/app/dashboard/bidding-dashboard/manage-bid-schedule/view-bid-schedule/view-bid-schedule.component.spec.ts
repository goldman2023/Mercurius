import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBidScheduleComponent } from './view-bid-schedule.component';

describe('ViewBidScheduleComponent', () => {
  let component: ViewBidScheduleComponent;
  let fixture: ComponentFixture<ViewBidScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBidScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBidScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
