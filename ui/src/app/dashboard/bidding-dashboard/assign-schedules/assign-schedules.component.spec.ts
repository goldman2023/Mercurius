import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSchedulesComponent } from './assign-schedules.component';

describe('AssignSchedulesComponent', () => {
  let component: AssignSchedulesComponent;
  let fixture: ComponentFixture<AssignSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
