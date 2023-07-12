import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFacilityTypeComponent } from './update-facility-type.component';

describe('UpdateFacilityTypeComponent', () => {
  let component: UpdateFacilityTypeComponent;
  let fixture: ComponentFixture<UpdateFacilityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFacilityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFacilityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
