import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-update-facility-type',
  templateUrl: './update-facility-type.component.html',
  styleUrls: ['./update-facility-type.component.scss']
})
export class UpdateFacilityTypeComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected

  FacilityTypeForm = new FormGroup({
    facilitytype_name: new FormControl('', Validators.required),
    facilitytype_desc: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    created_by: new FormControl(''),
    created_date: new FormControl(''),
    updated_by: new FormControl(''),
    facilitytype_id: new FormControl(''),
  });

  facility_type_facilityName =
  this.FacilityTypeForm.controls['facilitytype_name'];
facility_type_facility_desc =
  this.FacilityTypeForm.controls['facilitytype_desc'];
facility_type_facility_start_date =
  this.FacilityTypeForm.controls['start_date'];
facility_type_facility_end_date = this.FacilityTypeForm.controls['end_date'];


  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  private store: Store<appReducer.AppState>,
  public dialog: MatDialog
) {
  this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  this.updateData = data.dataKey;
  this.resetData = data.dataKey;
  this.editName = data.editName;



    this.FacilityTypeForm.patchValue({
      facilitytype_name: this.updateData.facilitytype_name,
      facilitytype_desc: this.updateData.facilitytype_desc,
      facilitytype_id: this.updateData.facilitytype_id,
      start_date: this.updateData.start_date,
      end_date: this.updateData.end_date,
      created_by: this.updateData.created_by,
      created_date: this.updateData.created_date,
      updated_by: this.user_data.id,
    });
}

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.updateSuccess) {
        this.updateSuccess = authdata.updateSuccess;
        this.facilityTypesName = authdata.FacilityTypes
      }
  })}
  resetcf() {



      this.FacilityTypeForm.patchValue({
        facilitytype_name: this.updateData.facilitytype_name,
        facilitytype_desc: this.updateData.facilitytype_desc,
        start_date: this.updateData.start_date,
        end_date: this.updateData.end_date,
        facilitytype_id: this.updateData.facilitytype_id,
        updated_by: this.user_data.id,
        created_by: this.updateData.created_by,
        created_date: this.updateData.created_date,
      });
}

updateFacilityType() {
  this.store.dispatch(
    new AdminActions.GetUPDATEFacilityType(this.FacilityTypeForm.value)
  );
}
close() {
  this.store.dispatch(new AdminActions.Clear());
}

}
