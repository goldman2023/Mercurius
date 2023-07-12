import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BidLeaveVacationComponent } from './bid-leave-vacation.component';

describe('BidLeaveVacationComponent', () => {
  let component: BidLeaveVacationComponent;
  let fixture: ComponentFixture<BidLeaveVacationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BidLeaveVacationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BidLeaveVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
