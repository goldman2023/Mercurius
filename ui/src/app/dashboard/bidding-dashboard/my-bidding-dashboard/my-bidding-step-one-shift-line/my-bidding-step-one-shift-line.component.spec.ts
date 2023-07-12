import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyBiddingStepOneShiftLineComponent } from './my-bidding-step-one-shift-line.component';

describe('MyBiddingStepOneShiftLineComponent', () => {
  let component: MyBiddingStepOneShiftLineComponent;
  let fixture: ComponentFixture<MyBiddingStepOneShiftLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBiddingStepOneShiftLineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBiddingStepOneShiftLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
