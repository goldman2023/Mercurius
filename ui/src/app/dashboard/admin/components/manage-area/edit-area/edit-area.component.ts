import { Component, Inject } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss'],
})
export class EditAreaComponent {
  areaData;
  updateSuccess = false;
  user_data;
  manageArea = new FormGroup({
    areaname: new FormControl('', Validators.required),
    areadescription: new FormControl(''),
    facilityidref: new FormControl(''),
    created_by: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    areaid: new FormControl(''),
  });
  manage_area_name = this.manageArea.controls['areaname'];
  manage_area_description = this.manageArea.controls['areadescription'];
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.updateSuccess) {
        this.updateSuccess = authdata.updateSuccess;
      }
    });

    this.areaData = data.dataKey;
    this.manageArea.patchValue({
      areaname: this.areaData.areaname,
      areadescription: this.areaData.areadescription,
      facilityidref: this.areaData.facilityidref,
      created_by: this.areaData.created_by,
      created_date: this.areaData.created_date,
      start_date: this.areaData.start_date,
      end_date: this.areaData.end_date,
      updated_by: this.areaData.updated_by,
      areaid: this.areaData.areaid,
    });
  }
  reset() {
    this.manageArea.patchValue({
      areaname: this.areaData.areaname,
      areadescription: this.areaData.areadescription,
      facilityidref: this.areaData.facilityidref,
      created_by: this.areaData.created_by,
      created_date: this.areaData.created_date,
      start_date: this.areaData.start_date,
      end_date: this.areaData.end_date,
      updated_by: this.areaData.updated_by,
      areaid: this.areaData.areaid,
    });
  }
  editArea() {
    this.manageArea.patchValue({
      updated_by: this.user_data.id,
    });
    this.store.dispatch(
      new AdminActions.GetUPDATEFacilityArea(this.manageArea.value)
    );
  }
}
