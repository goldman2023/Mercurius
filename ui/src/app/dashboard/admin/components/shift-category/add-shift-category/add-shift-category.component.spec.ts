import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftCategoryComponent } from './add-shift-category.component';

describe('AddShiftCategoryComponent', () => {
  let component: AddShiftCategoryComponent;
  let fixture: ComponentFixture<AddShiftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShiftCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
