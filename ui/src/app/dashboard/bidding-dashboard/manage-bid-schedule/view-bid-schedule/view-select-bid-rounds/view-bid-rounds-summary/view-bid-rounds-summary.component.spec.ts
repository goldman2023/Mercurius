import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBidRoundsSummaryComponent } from './view-bid-rounds-summary.component';

describe('ViewBidRoundsSummaryComponent', () => {
  let component: ViewBidRoundsSummaryComponent;
  let fixture: ComponentFixture<ViewBidRoundsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBidRoundsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBidRoundsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
