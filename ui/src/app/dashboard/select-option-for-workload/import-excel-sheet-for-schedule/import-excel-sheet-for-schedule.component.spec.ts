import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImportExcelSheetForScheduleComponent } from './import-excel-sheet-for-schedule.component';

describe('ImportExcelSheetForScheduleComponent', () => {
  let component: ImportExcelSheetForScheduleComponent;
  let fixture: ComponentFixture<ImportExcelSheetForScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExcelSheetForScheduleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportExcelSheetForScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
