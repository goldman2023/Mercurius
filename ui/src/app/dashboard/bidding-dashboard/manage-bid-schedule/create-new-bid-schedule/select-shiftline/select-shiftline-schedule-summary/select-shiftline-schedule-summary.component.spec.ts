import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectShiftlineScheduleSummaryComponent } from './select-shiftline-schedule-summary.component';

describe('SelectShiftlineScheduleSummaryComponent', () => {
  let component: SelectShiftlineScheduleSummaryComponent;
  let fixture: ComponentFixture<SelectShiftlineScheduleSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectShiftlineScheduleSummaryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectShiftlineScheduleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
