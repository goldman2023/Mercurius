import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTotalEveShiftLinesDataPage } from './view-total-eve-shift-lines-data.page';

describe('ViewTotalEveShiftLinesDataPage', () => {
  let component: ViewTotalEveShiftLinesDataPage;
  let fixture: ComponentFixture<ViewTotalEveShiftLinesDataPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTotalEveShiftLinesDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTotalEveShiftLinesDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
