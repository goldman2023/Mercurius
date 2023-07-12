import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeaveSelectionConfirmationComponent } from './leave-selection-confirmation.component';

describe('LeaveSelectionConfirmationComponent', () => {
  let component: LeaveSelectionConfirmationComponent;
  let fixture: ComponentFixture<LeaveSelectionConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveSelectionConfirmationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveSelectionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
