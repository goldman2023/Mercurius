import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-update-qualifications',
  templateUrl: './update-qualifications.component.html',
  styleUrls: ['./update-qualifications.component.scss']
})
export class UpdateQualificationsComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected


  updateQualificationForm = new FormGroup({
    qual_name: new FormControl('', Validators.required),
    qual_description: new FormControl('', Validators.required),
    qual_updated_by: new FormControl(''),
    eff_start_date: new FormControl('', Validators.required),
    eff_end_date: new FormControl('', Validators.required),
    id: new FormControl(''),
    qual_created_by: new FormControl(''),
    qual_created_date: new FormControl(''),
  });


  qual_name = this.updateQualificationForm.controls['qual_name'];
  qual_description = this.updateQualificationForm.controls['qual_description'];
  effStart_date = this.updateQualificationForm.controls['eff_start_date'];
  effEnd_date = this.updateQualificationForm.controls['eff_end_date'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private store: Store<appReducer.AppState>,
  public dialog: MatDialog
) {
  this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  this.updateData = data.dataKey;
  this.resetData = data.dataKey;
  this.editName = data.editName;



    this.updateQualificationForm.patchValue({
      qual_name: this.updateData.qual_name,
      qual_description: this.updateData.qual_description,
      qual_updated_by: this.user_data.id,
      eff_start_date: this.updateData.eff_start_date,
      eff_end_date: this.updateData.eff_end_date,
      qual_created_by: this.updateData.qual_created_by,
      qual_created_date: this.updateData.qual_created_date,
      id: this.updateData.id,
    });
  }
  resetcf() {

      this.updateQualificationForm.patchValue({
        qual_name: this.updateData.qual_name,
        qual_description: this.updateData.qual_description,
        qual_updated_by: this.user_data.id,
        eff_start_date: this.updateData.eff_start_date,
        eff_end_date: this.updateData.eff_end_date,
        id: this.updateData.id,
      });

  }
  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
    if (!this.updateSuccess) {
      this.updateSuccess = authdata.updateSuccess;
      this.facilityTypesName = authdata.FacilityTypes
    }
  });
  }
  updateQualification() {
    this.store.dispatch(
      new AdminActions.GetUPDATEQualification(
        this.updateQualificationForm.value
      )
    );
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
}
