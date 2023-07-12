import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import moment from 'moment';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-add-shift-category',
  templateUrl: './add-shift-category.component.html',
  styleUrls: ['./add-shift-category.component.scss']
})
export class AddShiftCategoryComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;
  modal_data
  facilityTypesName;

  shiftCategoryForm = new FormGroup({
    shcategory_name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    created_by: new FormControl(''),
  });

  shcategory_name = this.shiftCategoryForm.controls['shcategory_name'];
  system_shift_start_date = this.shiftCategoryForm.controls['start_date'];
  system_shift_end_date = this.shiftCategoryForm.controls['end_date'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.modal_data = data;
    this.addFunctionName = data.addName;
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (data.addName === 'Facility') {
      this.store.dispatch(new AdminActions.GetFacilityTypes());
      this.store.dispatch(new AdminActions.GetFacilityTypes());
    }
  }

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
    });


  }

  shiftCategory() {
    this.shiftCategoryForm.patchValue({
      start_date: moment(this.shiftCategoryForm.value.start_date).format(
        'YYYY-MM-DD'
      ),
      end_date: moment(this.shiftCategoryForm.value.end_date).format(
        'YYYY-MM-DD'
      ),
      created_by: this.user_data.id,
    });
    this.store.dispatch(
      new AdminActions.GetAddShiftCategory(this.shiftCategoryForm.value)
    );
  }

  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
}
