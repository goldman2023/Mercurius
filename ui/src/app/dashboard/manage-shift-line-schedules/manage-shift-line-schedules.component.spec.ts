import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageShiftLineSchedulesComponent } from './manage-shift-line-schedules.component';

describe('ManageShiftLineSchedulesComponent', () => {
  let component: ManageShiftLineSchedulesComponent;
  let fixture: ComponentFixture<ManageShiftLineSchedulesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageShiftLineSchedulesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageShiftLineSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
