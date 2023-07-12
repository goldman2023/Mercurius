import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectVacationSlotsComponent } from './view-select-vacation-slots.component';

describe('ViewSelectVacationSlotsComponent', () => {
  let component: ViewSelectVacationSlotsComponent;
  let fixture: ComponentFixture<ViewSelectVacationSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectVacationSlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectVacationSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
