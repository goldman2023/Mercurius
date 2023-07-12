import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTotalMidShiftLinesDataPage } from './view-total-mid-shift-lines-data.page';

describe('ViewTotalMidShiftLinesDataPage', () => {
  let component: ViewTotalMidShiftLinesDataPage;
  let fixture: ComponentFixture<ViewTotalMidShiftLinesDataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTotalMidShiftLinesDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTotalMidShiftLinesDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
