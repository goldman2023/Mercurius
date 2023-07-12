import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import moment from 'moment';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-add-facility-type',
  templateUrl: './add-facility-type.component.html',
  styleUrls: ['./add-facility-type.component.scss']
})
export class AddFacilityTypeComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;
  modal_data
  facilityTypesName;


  FacilityTypeForm = new FormGroup({
    facilitytype_name: new FormControl('', Validators.required),
    facilitytype_desc: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    created_by: new FormControl(''),
  });

  facility_type_facility_name =
    this.FacilityTypeForm.controls['facilitytype_name'];
  facility_type_facility_desc =
    this.FacilityTypeForm.controls['facilitytype_desc'];
  facility_type_facility_start_date =
    this.FacilityTypeForm.controls['start_date'];
  facility_type_facility_end_date = this.FacilityTypeForm.controls['end_date'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.modal_data = data;
    this.addFunctionName = data.addName;
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  }


  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
    });

  }
    AddFacilityType() {
    this.FacilityTypeForm.patchValue({
      eff_start_date: moment(this.FacilityTypeForm.value.eff_start_date).format(
        'YYYY-MM-DD'
      ),
      eff_end_date: moment(this.FacilityTypeForm.value.eff_end_date).format(
        'YYYY-MM-DD'
      ),
      created_by: this.user_data.id,
    });
    this.store.dispatch(
      new AdminActions.GetAddFacilityType(this.FacilityTypeForm.value)
    );
  }

  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
}
