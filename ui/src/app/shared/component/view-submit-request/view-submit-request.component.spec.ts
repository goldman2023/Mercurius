import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubmitRequestComponent } from './view-submit-request.component';

describe('ViewSubmitRequestComponent', () => {
  let component: ViewSubmitRequestComponent;
  let fixture: ComponentFixture<ViewSubmitRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSubmitRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubmitRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
