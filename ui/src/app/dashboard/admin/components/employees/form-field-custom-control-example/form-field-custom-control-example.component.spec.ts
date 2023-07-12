import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldCustomControlExampleComponent } from './form-field-custom-control-example.component';

describe('FormFieldCustomControlExampleComponent', () => {
  let component: FormFieldCustomControlExampleComponent;
  let fixture: ComponentFixture<FormFieldCustomControlExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFieldCustomControlExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldCustomControlExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
