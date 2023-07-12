import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPeriodComponent } from './pay-period.component';

describe('PayPeriodComponent', () => {
  let component: PayPeriodComponent;
  let fixture: ComponentFixture<PayPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayPeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
