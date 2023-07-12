import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShiftCategoryStartTimePage } from './shift-category-start-time.page';

describe('ShiftCategoryStartTimePage', () => {
  let component: ShiftCategoryStartTimePage;
  let fixture: ComponentFixture<ShiftCategoryStartTimePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCategoryStartTimePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftCategoryStartTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
