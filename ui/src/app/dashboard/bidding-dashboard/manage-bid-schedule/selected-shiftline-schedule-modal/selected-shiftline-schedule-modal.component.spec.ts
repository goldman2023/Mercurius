import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectedShiftlineScheduleModalComponent } from './selected-shiftline-schedule-modal.component';

describe('SelectedShiftlineScheduleModalComponent', () => {
  let component: SelectedShiftlineScheduleModalComponent;
  let fixture: ComponentFixture<SelectedShiftlineScheduleModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedShiftlineScheduleModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedShiftlineScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
