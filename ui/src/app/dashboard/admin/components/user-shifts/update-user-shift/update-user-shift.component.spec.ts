import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserShiftComponent } from './update-user-shift.component';

describe('UpdateUserShiftComponent', () => {
  let component: UpdateUserShiftComponent;
  let fixture: ComponentFixture<UpdateUserShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
