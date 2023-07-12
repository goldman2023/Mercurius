import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartMyFreeTrialComponent } from './start-my-free-trial.component';

describe('StartMyFreeTrialComponent', () => {
  let component: StartMyFreeTrialComponent;
  let fixture: ComponentFixture<StartMyFreeTrialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartMyFreeTrialComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartMyFreeTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
