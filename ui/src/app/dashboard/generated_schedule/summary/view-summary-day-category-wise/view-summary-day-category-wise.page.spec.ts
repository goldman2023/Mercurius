import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewSummaryDayCategoryWisePage } from './view-summary-day-category-wise.page';

describe('ViewSummaryDayCategoryWisePage', () => {
  let component: ViewSummaryDayCategoryWisePage;
  let fixture: ComponentFixture<ViewSummaryDayCategoryWisePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSummaryDayCategoryWisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSummaryDayCategoryWisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
