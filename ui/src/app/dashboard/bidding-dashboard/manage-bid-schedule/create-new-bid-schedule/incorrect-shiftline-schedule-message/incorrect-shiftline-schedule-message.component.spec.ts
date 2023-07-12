import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncorrectShiftlineScheduleMessageComponent } from './incorrect-shiftline-schedule-message.component';

describe('IncorrectShiftlineScheduleMessageComponent', () => {
  let component: IncorrectShiftlineScheduleMessageComponent;
  let fixture: ComponentFixture<IncorrectShiftlineScheduleMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IncorrectShiftlineScheduleMessageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncorrectShiftlineScheduleMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
