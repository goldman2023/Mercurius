import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicWatchScheduleComponent } from './basic-watch-schedule.component';

describe('BasicWatchScheduleComponent', () => {
  let component: BasicWatchScheduleComponent;
  let fixture: ComponentFixture<BasicWatchScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicWatchScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicWatchScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
