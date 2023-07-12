import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectedEmployeeSummaryComponent } from './selected-employee-summary.component';

describe('SelectedEmployeeSummaryComponent', () => {
  let component: SelectedEmployeeSummaryComponent;
  let fixture: ComponentFixture<SelectedEmployeeSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedEmployeeSummaryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedEmployeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
