import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAssignSchedulesModalComponent } from './save-assign-schedules-modal.component';

describe('SaveAssignSchedulesModalComponent', () => {
  let component: SaveAssignSchedulesModalComponent;
  let fixture: ComponentFixture<SaveAssignSchedulesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAssignSchedulesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAssignSchedulesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
