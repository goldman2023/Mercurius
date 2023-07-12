import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss'],
})
export class AddAreaComponent {
  areaData;
  user_data;
  addSuccess;

  manageArea = new FormGroup({
    areaname: new FormControl('', Validators.required),
    areadescription: new FormControl(''),
    facilityidref: new FormControl(''),
    created_by: new FormControl(''),
    start_date: new FormControl(null),
    end_date: new FormControl(null),
  });

  manage_area_name = this.manageArea.controls['areaname'];
  manage_area_description = this.manageArea.controls['areadescription'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.areaData = data;

    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
      }
    });
  }

  addArea() {
    this.manageArea.patchValue({
      facilityidref: this.areaData.facilityId,
      created_by: this.user_data.id,
    });
    this.store.dispatch(
      new AdminActions.GetAddFacilityArea(this.manageArea.value)
    );
  }
}
