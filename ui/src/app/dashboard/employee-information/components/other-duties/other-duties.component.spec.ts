import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDutiesComponent } from './other-duties.component';

describe('OtherDutiesComponent', () => {
  let component: OtherDutiesComponent;
  let fixture: ComponentFixture<OtherDutiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDutiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
