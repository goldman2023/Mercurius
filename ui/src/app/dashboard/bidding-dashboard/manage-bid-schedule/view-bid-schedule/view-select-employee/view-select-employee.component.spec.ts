import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectEmployeeComponent } from './view-select-employee.component';

describe('ViewSelectEmployeeComponent', () => {
  let component: ViewSelectEmployeeComponent;
  let fixture: ComponentFixture<ViewSelectEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSelectEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
