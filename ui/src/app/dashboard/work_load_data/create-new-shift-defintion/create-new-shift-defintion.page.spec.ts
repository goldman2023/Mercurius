import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateNewShiftDefintionPage } from './create-new-shift-defintion.page';

describe('CreateNewShiftDefintionPage', () => {
  let component: CreateNewShiftDefintionPage;
  let fixture: ComponentFixture<CreateNewShiftDefintionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewShiftDefintionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewShiftDefintionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
