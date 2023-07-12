import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacilityTypeComponent } from './add-facility-type.component';

describe('AddFacilityTypeComponent', () => {
  let component: AddFacilityTypeComponent;
  let fixture: ComponentFixture<AddFacilityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFacilityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacilityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
