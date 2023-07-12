import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import moment from 'moment';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';
@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss']
})
export class AddFacilityComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;
  modal_data
  facilityTypesName;

  facilityForm = new FormGroup({
    facilityname: new FormControl('', Validators.required),
    facilitycity: new FormControl('', Validators.required),
    facilityabbr: new FormControl('', Validators.required),
    facilitytypenameref: new FormControl('', Validators.required),
    facilitystate: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    facilitytypeidref: new FormControl(''),
    created_by: new FormControl(''),
  });



  facility_name = this.facilityForm.controls['facilityname'];
  facility_city = this.facilityForm.controls['facilitycity'];
  facility_abbr = this.facilityForm.controls['facilityabbr'];
  facility_type_nameref = this.facilityForm.controls['facilitytypenameref'];
  facility_state = this.facilityForm.controls['facilitystate'];
  facility_start_date = this.facilityForm.controls['start_date'];
  facility_end_date = this.facilityForm.controls['end_date'];

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

  addFacility() {
    this.facilityForm.patchValue({
      start_date: moment(this.facilityForm.value.start_date).format(
        'YYYY-MM-DD'
      ),
      end_date: moment(this.facilityForm.value.end_date).format('YYYY-MM-DD'),
      created_by: this.user_data.id,
      facilitytypeidref:
        this.facilityForm.value.facilitytypenameref.facilitytype_id,
      facilitytypenameref:
        this.facilityForm.value.facilitytypenameref.facilitytype_name,
    });
    this.store.dispatch(
      new AdminActions.GetAddFacility(this.facilityForm.value)
    );
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
}
