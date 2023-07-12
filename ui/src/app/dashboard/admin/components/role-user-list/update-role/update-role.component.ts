import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';


import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected

  updateRoleForm = new FormGroup({
    role_name: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    updated_by: new FormControl(''),
    created_by: new FormControl(''),
    created_date: new FormControl(''),
    id: new FormControl(''),
  });


  add_form_roleNam = this.updateRoleForm.controls['role_name'];
  add_form_startDate = this.updateRoleForm.controls['start_date'];
  add_form_endDate = this.updateRoleForm.controls['end_date'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>,
    public dialog: MatDialog
  ) {
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.updateData = data.dataKey;
    this.resetData = data.dataKey;
    this.editName = data.editName;

    if (this.editName === 'Role') {
      this.updateRoleForm.patchValue({
        role_name: this.updateData.role_name,
        start_date: this.updateData.start_date,
        end_date: this.updateData.end_date,
        updated_by: this.user_data.id,
        id: this.updateData.id,
        created_by: this.updateData.created_by,
        created_date: this.updateData.created_date,
      });
    } }

  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.updateSuccess) {
        this.updateSuccess = authdata.updateSuccess;
      }
    });
  }

  resetcf() {
      this.updateRoleForm.patchValue({
        role_name: this.updateData.role_name,
        start_date: this.updateData.start_date,
        end_date: this.updateData.end_date,
        updated_by: this.user_data.id,
        created_by: this.user_data.created_by,
        created_date: this.user_data.created_date,
        id: this.updateData.id,
      });
  }


  close() {
    this.store.dispatch(new AdminActions.Clear());
  }

  update() {
    this.store.dispatch(
      new AdminActions.GetUPDATERole(this.updateRoleForm.value)
    );
  }
}
