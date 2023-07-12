import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlankHeaderForModalPageComponent } from './blank-header-for-modal-page.component';

describe('BlankHeaderForModalPageComponent', () => {
  let component: BlankHeaderForModalPageComponent;
  let fixture: ComponentFixture<BlankHeaderForModalPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlankHeaderForModalPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlankHeaderForModalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
