import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Store } from '@ngrx/store';



import * as appReducer from '../../../../store/app.reducers';
import * as AdminActions from '../../store/admin.actions';
import { ActionsObject } from '../../store/adminModel';



@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  openAll = true;
  role_id
  selected
  selectedChanged :boolean = false
  toppings = new FormControl();
  updateRoleForm = this.fb.group({
    roleName: ['', Validators.required],
    effectiveStartDate: ['', Validators.required],
    expirationDate: ['', Validators.required],
  });
  activeRoles;
  Permissions;
  defaultData;
  user_data: any | {}

  allComplete: boolean = false;
  allComplete2: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<appReducer.AppState>
  ) {}

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.store.dispatch(new AdminActions.GetActiveRoles());
    this.store.select('adminStore').subscribe((authdata) => {
      this.activeRoles = authdata.activeRoles;
      this.Permissions = authdata.permissionsData;
      this.defaultData = authdata.permissionsData
      if(this.selectedChanged === false){
        this.selected = this.activeRoles[0]?.id
      }
    });
  }
  selectAll(item, event){
    this.Permissions.filter(res => res.modu_name === item.modu_name)
    .forEach(res => {
      res.actions.forEach(func => {
        func.func_name_arry.forEach(action => {
          action.status = event.checked;
        });
      });
    });
  }
  selectAllChild(item, event) {
    const permissions = this.Permissions.filter(res => res.modu_name === item.modu_name);
    permissions.forEach(permission => {
      const func = permission.actions.filter(action => action.func_name === item.func_name)[0];
      if (func && func.func_name_arry) {
        func.func_name_arry.forEach(action => {
          action.status = event.checked;
        });
      }
    });
  }
  
  isCheckedAnyChild(item){
   return item.actions.some(t => t.func_name_arry.some(t => t.status))
  }
  isCheckedAnyChildFunctions(item){
   return  item.func_name_arry.some(t => t.status)
  }


 

  panelOpenState = false;
  submit() {
  }
  permissionForm() {
    let PermissionActions = [];
    this.Permissions.forEach((permission) => {
      permission.actions.forEach((item) => {
        item.func_name_arry.forEach(res => {
          let permissios =  {
            role_id: res.role_id,
            permission_id: res.permission_id,
            status: res.status
        }
          PermissionActions.push(permissios);
        })
      });
    });
    this.store.dispatch(new AdminActions.GetUpdatePermissions(PermissionActions));
  }

  filterChange(event) {
    this.selectedChanged = true
    this.role_id = event.value
    this.selected = event.value
    this.store.dispatch(new AdminActions.GetPermissionsByRoleID(event.value));
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
  reset(){
    this.store.dispatch(new AdminActions.GetActiveRoles());
  }
}
