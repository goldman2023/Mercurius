import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShiftCategoryComponent } from './update-shift-category.component';

describe('UpdateShiftCategoryComponent', () => {
  let component: UpdateShiftCategoryComponent;
  let fixture: ComponentFixture<UpdateShiftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateShiftCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateShiftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
