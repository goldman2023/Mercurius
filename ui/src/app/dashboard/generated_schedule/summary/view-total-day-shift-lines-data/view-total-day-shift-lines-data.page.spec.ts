import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTotalDayShiftLinesDataPage } from './view-total-day-shift-lines-data.page';

describe('ViewTotalDayShiftLinesDataPage', () => {
  let component: ViewTotalDayShiftLinesDataPage;
  let fixture: ComponentFixture<ViewTotalDayShiftLinesDataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTotalDayShiftLinesDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTotalDayShiftLinesDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
