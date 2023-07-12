import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserShiftComponent } from './add-user-shift.component';

describe('AddUserShiftComponent', () => {
  let component: AddUserShiftComponent;
  let fixture: ComponentFixture<AddUserShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
