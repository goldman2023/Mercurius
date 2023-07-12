import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-update-shift-category',
  templateUrl: './update-shift-category.component.html',
  styleUrls: ['./update-shift-category.component.scss']
})
export class UpdateShiftCategoryComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected


  shiftCategoryForm = new FormGroup({
    shcategory_name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    shcategory_id: new FormControl(''),
    created_by: new FormControl(''),
    created_date: new FormControl(''),
    updated_by: new FormControl(''),
  });

  shcategory_name = this.shiftCategoryForm.controls['shcategory_name'];
  system_shift_start_date = this.shiftCategoryForm.controls['start_date'];
  system_shift_end_date = this.shiftCategoryForm.controls['end_date'];

  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>,
    public dialog: MatDialog
  ) {
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.updateData = data.dataKey;
    this.resetData = data.dataKey;
    this.editName = data.editName;


    this.shiftCategoryForm.patchValue({
      shcategory_id: this.updateData.shcategory_id,
      shcategory_name: this.updateData.shcategory_name,
      start_date: this.updateData.start_date,
      end_date: this.updateData.end_date,
      created_by: this.updateData.created_by,
      created_date: this.updateData.created_date,
      updated_by: this.user_data.id,
    })
  }

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.updateSuccess) {
        this.updateSuccess = authdata.updateSuccess;
        this.facilityTypesName = authdata.FacilityTypes
      }
    });
  }
  resetcf() {

      this.shiftCategoryForm.patchValue({
        shcategory_id: this.updateData.shcategory_id,
        shcategory_name: this.updateData.shcategory_name,
        start_date: this.updateData.start_date,
        end_date: this.updateData.end_date,
        created_by: this.updateData.created_by,
        created_date: this.updateData.created_date,
        updated_by: this.user_data.id,
      })

  }

  updateShiftCategoty(){
    this.store.dispatch(
      new AdminActions.GetUPDATEShiftCategory(this.shiftCategoryForm.value)
    );
  }

  close() {
    this.store.dispatch(new AdminActions.Clear());
  }

}
