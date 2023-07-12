import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-update-facility',
  templateUrl: './update-facility.component.html',
  styleUrls: ['./update-facility.component.scss']
})
export class UpdateFacilityComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected


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
    facilityid: new FormControl('')
  });

  facility_name = this.facilityForm.controls['facilityname'];
  facility_city = this.facilityForm.controls['facilitycity'];
  facility_abbr = this.facilityForm.controls['facilityabbr'];
  facility_type_nameref = this.facilityForm.controls['facilitytypenameref'];
  facility_state = this.facilityForm.controls['facilitystate'];
  facility_start_date = this.facilityForm.controls['start_date'];
  facility_end_date = this.facilityForm.controls['end_date'];


  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
  private store: Store<appReducer.AppState>,
  public dialog: MatDialog
) {
  this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  this.updateData = data.dataKey;
  this.resetData = data.dataKey;
  this.editName = data.editName;

  this.facilityForm.patchValue({
    facilityid: this.updateData.facilityid,
    facilityname: this.updateData.facilityname,
    facilityabbr: this.updateData.facilityabbr,
    facilitycity: this.updateData.facilitycity,
    facilitystate: this.updateData.facilitystate,
    facilitytypenameref: this.updateData.facilitytypenameref,
    facilitytypeidref: this.updateData.facilitytypeidref,
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
    this.facilityTypesName.forEach((item, index)=> {
      if(item.facilitytype_id === this.updateData.facilitytypeidref){
        this.selected = this.facilityTypesName[index];
      }

    } )
  }

  resetcf() {

    if(this.editName == 'Facility'){
      this.facilityForm.patchValue({
        facilityid: this.updateData.facilityid,
        facilityname: this.updateData.facilityname,
        facilityabbr: this.updateData.facilityabbr,
        facilitycity: this.updateData.facilitycity,
        facilitystate: this.updateData.facilitystate,
        facilitytypenameref: this.updateData.facilitytypenameref,
        facilitytypeidref: this.updateData.facilitytypeidref,
        start_date: this.updateData.start_date,
        end_date: this.updateData.end_date,
        created_by: this.updateData.created_by,
        created_date: this.updateData.created_date,
        updated_by: this.user_data.id,
      })

    }
  }

  facilityFormupdate(){
    this.store.dispatch(
      new AdminActions.GetUPDATEFacility(this.facilityForm.value)
    );
  }

  filterChange(event) {
    this.selected = event.value
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
}
