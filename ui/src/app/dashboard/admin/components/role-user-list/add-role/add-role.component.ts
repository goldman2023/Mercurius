import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

import { Store } from '@ngrx/store';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

interface Roles {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;
  facilityTypesName;

  addRoleForm = new FormGroup({
    role_name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    created_by: new FormControl(''),
  });


  add_form_role_nam = this.addRoleForm.controls['role_name'];
  add_form_start_date = this.addRoleForm.controls['start_date'];
  add_form_end_date = this.addRoleForm.controls['end_date'];


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

  addRole() {
    this.addRoleForm.setValue({
      role_name: this.addRoleForm.value.role_name.trim(),
      start_date: moment(this.addRoleForm.value.start_date).format(
        'YYYY-MM-DD'
      ),
      end_date: moment(this.addRoleForm.value.end_date).format('YYYY-MM-DD'),
      created_by: this.user_data.id,
    });
    this.store.dispatch(new AdminActions.GetAddRole(this.addRoleForm.value));
  }

  close() {
    this.store.dispatch(new AdminActions.Clear());
  }


}
