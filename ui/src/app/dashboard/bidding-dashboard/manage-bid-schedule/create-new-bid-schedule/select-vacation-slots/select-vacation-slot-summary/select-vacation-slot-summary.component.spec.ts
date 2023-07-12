import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectVacationSlotSummaryComponent } from './select-vacation-slot-summary.component';

describe('SelectVacationSlotSummaryComponent', () => {
  let component: SelectVacationSlotSummaryComponent;
  let fixture: ComponentFixture<SelectVacationSlotSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVacationSlotSummaryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectVacationSlotSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
