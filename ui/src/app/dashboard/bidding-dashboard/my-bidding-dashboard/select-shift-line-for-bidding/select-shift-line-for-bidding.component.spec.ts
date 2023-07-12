import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectShiftLineForBiddingComponent } from './select-shift-line-for-bidding.component';

describe('SelectShiftLineForBiddingComponent', () => {
  let component: SelectShiftLineForBiddingComponent;
  let fixture: ComponentFixture<SelectShiftLineForBiddingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectShiftLineForBiddingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectShiftLineForBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
