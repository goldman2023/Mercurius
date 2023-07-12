import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectShiftlineByBidManagerComponent } from './select-shiftline-by-bid-manager.component';

describe('SelectShiftlineByBidManagerComponent', () => {
  let component: SelectShiftlineByBidManagerComponent;
  let fixture: ComponentFixture<SelectShiftlineByBidManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectShiftlineByBidManagerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectShiftlineByBidManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
