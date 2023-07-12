import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectShiftlineComponent } from './view-select-shiftline.component';

describe('ViewSelectShiftlineComponent', () => {
  let component: ViewSelectShiftlineComponent;
  let fixture: ComponentFixture<ViewSelectShiftlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectShiftlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectShiftlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
