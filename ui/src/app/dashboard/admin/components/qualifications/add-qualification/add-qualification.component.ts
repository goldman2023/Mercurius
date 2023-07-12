import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


import { Store } from '@ngrx/store';
import moment from 'moment';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;

  addQualificationForm = new FormGroup({
    qual_name: new FormControl('', Validators.required),
    qual_description: new FormControl('', Validators.required),
    qual_created_by: new FormControl(''),
    eff_start_date: new FormControl('', Validators.required),
    eff_end_date: new FormControl('', Validators.required),
  });

  qual_name = this.addQualificationForm.controls['qual_name'];
  qual_description = this.addQualificationForm.controls['qual_description'];
  qual_eff_start_date = this.addQualificationForm.controls['eff_start_date'];
  qual_eff_end_date = this.addQualificationForm.controls['eff_end_date'];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>
  ) {
    this.addFunctionName = data.addName;
  }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
      }
    });
  }

  AddQualification() {
    this.addQualificationForm.patchValue({
      eff_start_date: moment(
        this.addQualificationForm.value.eff_start_date
      ).format('YYYY-MM-DD'),
      eff_end_date: moment(this.addQualificationForm.value.eff_end_date).format(
        'YYYY-MM-DD'
      ),
      qual_created_by: this.user_data.id,
    });
    this.store.dispatch(
      new AdminActions.GetAddQualification(this.addQualificationForm.value)
    );
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }

}
