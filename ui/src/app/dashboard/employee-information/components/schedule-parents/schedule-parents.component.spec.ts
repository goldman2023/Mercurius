import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleParentsComponent } from './schedule-parents.component';

describe('ScheduleParentsComponent', () => {
  let component: ScheduleParentsComponent;
  let fixture: ComponentFixture<ScheduleParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleParentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
