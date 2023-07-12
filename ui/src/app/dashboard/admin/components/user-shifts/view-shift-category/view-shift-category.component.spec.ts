import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShiftCategoryComponent } from './view-shift-category.component';

describe('ViewShiftCategoryComponent', () => {
  let component: ViewShiftCategoryComponent;
  let fixture: ComponentFixture<ViewShiftCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShiftCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewShiftCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
