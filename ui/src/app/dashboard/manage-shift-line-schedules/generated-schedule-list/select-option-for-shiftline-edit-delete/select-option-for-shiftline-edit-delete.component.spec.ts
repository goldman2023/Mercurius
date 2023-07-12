import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectOptionForShiftlineEditDeleteComponent } from './select-option-for-shiftline-edit-delete.component';

describe('SelectOptionForShiftlineEditDeleteComponent', () => {
  let component: SelectOptionForShiftlineEditDeleteComponent;
  let fixture: ComponentFixture<SelectOptionForShiftlineEditDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOptionForShiftlineEditDeleteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOptionForShiftlineEditDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
