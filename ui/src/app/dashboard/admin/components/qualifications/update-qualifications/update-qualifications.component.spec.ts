import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQualificationsComponent } from './update-qualifications.component';

describe('UpdateQualificationsComponent', () => {
  let component: UpdateQualificationsComponent;
  let fixture: ComponentFixture<UpdateQualificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateQualificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQualificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
