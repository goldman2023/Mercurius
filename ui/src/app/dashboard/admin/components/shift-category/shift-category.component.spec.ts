import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCategoryComponent } from './shift-category.component';

describe('ShiftCategoryComponent', () => {
  let component: ShiftCategoryComponent;
  let fixture: ComponentFixture<ShiftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
