import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitRequestModalComponent } from './submit-request-modal.component';

describe('SubmitRequestModalComponent', () => {
  let component: SubmitRequestModalComponent;
  let fixture: ComponentFixture<SubmitRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
