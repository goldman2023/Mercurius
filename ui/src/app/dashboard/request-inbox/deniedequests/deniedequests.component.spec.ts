import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeniedequestsComponent } from './deniedequests.component';

describe('DeniedequestsComponent', () => {
  let component: DeniedequestsComponent;
  let fixture: ComponentFixture<DeniedequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeniedequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeniedequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
