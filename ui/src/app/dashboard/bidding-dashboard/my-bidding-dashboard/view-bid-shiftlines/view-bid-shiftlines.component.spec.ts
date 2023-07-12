import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewBidShiftlinesComponent } from './view-bid-shiftlines.component';

describe('ViewBidShiftlinesComponent', () => {
  let component: ViewBidShiftlinesComponent;
  let fixture: ComponentFixture<ViewBidShiftlinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBidShiftlinesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBidShiftlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
