import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInboxComponent } from './request-inbox.component';

describe('RequestInboxComponent', () => {
  let component: RequestInboxComponent;
  let fixture: ComponentFixture<RequestInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
