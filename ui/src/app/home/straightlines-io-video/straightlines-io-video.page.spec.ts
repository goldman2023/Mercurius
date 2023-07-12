import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StraightlinesIoVideoPage } from './straightlines-io-video.page';

describe('StraightlinesIoVideoPage', () => {
  let component: StraightlinesIoVideoPage;
  let fixture: ComponentFixture<StraightlinesIoVideoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StraightlinesIoVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StraightlinesIoVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
