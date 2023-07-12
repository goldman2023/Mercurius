import { Action } from '@ngrx/store';
import {
  ActionsObject,
  Employee,
  Facility,
  FacilityArea,
  FacilityType,
  FacilityTypes,
  moduleArraayModel,
  PermissionsModel,
  Qualification,
  Role,
  ShiftCategory,
  SystemShift,
  ViewSystemShift,
} from './adminModel';

export const CLEAR = '[Admin] clear';
export class Clear implements Action {
  readonly type = CLEAR;
}

export const GET_ALL_EMPLOYEES_BASED_ON_USER_ID = '[Admin] Get All Employees Based OnUser Id';
export const SET_ALL_EMPLOYEES_BASED_ON_USER_ID = '[Admin] Set All Employees Based OnUser Id';

export class GetAllEmployeesBasedOnUserId implements Action {
  readonly type = GET_ALL_EMPLOYEES_BASED_ON_USER_ID;
  constructor(public payload: number){}
}
export class SetAllEmployeesBasedOnUserId implements Action {
  readonly type = SET_ALL_EMPLOYEES_BASED_ON_USER_ID;
  constructor(public payload: Array<any>) {}
}
export const GET_ADD_NEW_EMPLOYEE = '[Admin] Get Add New Employee';
export const SET_ADD_NEW_EMPLOYEE = '[Admin] Set Add New Employee';

export class GetAddNewEmployee implements Action {
  readonly type = GET_ADD_NEW_EMPLOYEE;
  constructor(public payload: {}){}
}
export class SetAddNewEmployee implements Action {
  readonly type = SET_ADD_NEW_EMPLOYEE;
  constructor(public payload: Array<any>) {}
}

export const GET_UPDATE_EMPLOYEE = '[Admin] Get Update Employee';
export const SET_UPDATE_EMPLOYEE = '[Admin] Set Update Employee';

export class GetUpdateEmployee implements Action {
  readonly type = GET_UPDATE_EMPLOYEE;
  constructor(public payload: {empDetails:any}){}
}
export class SetUpdateEmployee implements Action {
  readonly type = SET_UPDATE_EMPLOYEE;
  constructor(public payload: Array<any>) {}
}

export const GET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID = '[Admin] Get All Active Employees Based OnUser Id';
export const SET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID = '[Admin] Set All Active Employees Based OnUser Id';

export class GetAllActiveEmployeesBasedOnUserId implements Action {
  readonly type = GET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID;
  constructor(public payload: {userId:number; status: number}){}
}
export class SetAllActiveEmployeesBasedOnUserId implements Action {
  readonly type = SET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID;
  constructor(public payload: Employee[]) {}
}


export const GET_ALL_ROLES = '[Admin] Get All Roles';
export const SET_ALL_ROLES = '[Admin] Set All Roles';

export class GetAllRoles implements Action {
  readonly type = GET_ALL_ROLES;
}
export class SetAllRoles implements Action {
  readonly type = SET_ALL_ROLES;
  constructor(public payload: Role[]) {}
}

export const GET_ACTIVE_ROLES = '[Admin] Get Active Roles';
export const SET_ACTIVE_ROLES = '[Admin] Set Active Roles';

export class GetActiveRoles implements Action {
  readonly type = GET_ACTIVE_ROLES;
}
export class SetActiveRoles implements Action {
  readonly type = SET_ACTIVE_ROLES;
  constructor(public payload: Role[]) {}
}

export const GET_ADD_ROLE = '[Admin] Get Add Role';
export const SET_ADD_ROLE = '[Admin] Set Add Role';

export class GetAddRole implements Action {
  readonly type = GET_ADD_ROLE;
  constructor(public payload: { role: Role }) {}
}
export class SetAddRole implements Action {
  readonly type = SET_ADD_ROLE;
  constructor(public payload: Role) {}
}
export const GET_INITIALS_CHECK = '[Admin] Get Initial Check';
export const SET_INITIALS_CHECK = '[Admin] Set Initial Check';

export class GetInitialCheck implements Action {
  readonly type = GET_INITIALS_CHECK;
  constructor(public payload: { managerid: number,initial: string }) {}
}
export class SetInitialCheck implements Action {
  readonly type = SET_INITIALS_CHECK;
  constructor(public payload: string) {}
}
export const GET_EMAIL_CHECK = '[Admin] Get Email Check';
export const SET_EMAIL_CHECK = '[Admin] Set Email Check';

export class GetEmailCheck implements Action {
  readonly type = GET_EMAIL_CHECK;
  constructor(public payload: { Email: string }) {}
}
export class SetEmailCheck implements Action {
  readonly type = SET_EMAIL_CHECK;
  constructor(public payload: string) {}
}

export const GET_UPDATE_ROLE = '[Admin] Get UPDATE Role';
export const SET_UPDATE_ROLE = '[Admin] Set UPDATE Role';

export class GetUPDATERole implements Action {
  readonly type = GET_UPDATE_ROLE;
  constructor(public payload: Role) {}
}
export class SetUPDATERole implements Action {
  readonly type = SET_UPDATE_ROLE;
  constructor(public payload: Role) {}
}

export const GET_PERMISSIONS_BY_ROLE_ID = '[Admin] Get Permissions By Role Id';
export const SET_PERMISSIONS_BY_ROLE_ID = '[Admin] Set Permissions By Role Id';

export class GetPermissionsByRoleID implements Action {
  readonly type = GET_PERMISSIONS_BY_ROLE_ID;
  constructor(public payload: number) {}
}
export class SetPermissionsByRoleID implements Action {
  readonly type = SET_PERMISSIONS_BY_ROLE_ID;
  constructor(public payload: PermissionsModel[]) {}
}

export const GET_All_ACTIONS = '[Admin] Get All Actions';
export const SET_All_ACTIONS = '[Admin] Set All Actions';

export class GetAllActions implements Action {
  readonly type = GET_All_ACTIONS;
  constructor(public payload: number) {}
}
export class SetAllActions implements Action {
  readonly type = SET_All_ACTIONS;
  func_name: string;
  constructor(public payload: { AllActions: any; role_id: number }) {}
}

export const GET_All_PERMISSIONS_ACTION_MODULE_NAME =
  '[Admin] Get All Permissions Actions Module Name';
export const SET_All_PERMISSIONS_ACTION_MODULE_NAME =
  '[Admin] Set All Permissions Actions Module Name';

export class GetAllPermissionsActionsModuleName implements Action {
  readonly type = GET_All_PERMISSIONS_ACTION_MODULE_NAME;
}
export class SetAllPermissionsActionsModuleName implements Action {
  readonly type = SET_All_PERMISSIONS_ACTION_MODULE_NAME;
  constructor(public payload: moduleArraayModel[]) {}
}

export const GET_UPDATE_PERMISSIONS = '[Admin] Get Update Permissions';
export const SET_UPDATE_PERMISSIONS = '[Admin] Set Update Permissions';

export class GetUpdatePermissions implements Action {
  readonly type = GET_UPDATE_PERMISSIONS;
  constructor(public payload: ActionsObject[]) {}
}
export class SetUpdatePermissions implements Action {
  readonly type = SET_UPDATE_PERMISSIONS;
  constructor(public payload: any) {}
}

export const GET_ALL_QUALIFICATION = '[Admin] Get All Qualification';
export const SET_ALL_QUALIFICATION = '[Admin] Set All Qualification';

export class GetAllQualification implements Action {
  readonly type = GET_ALL_QUALIFICATION;
}
export class SetAllQualification implements Action {
  readonly type = SET_ALL_QUALIFICATION;
  constructor(public payload: Qualification[]) {}
}

export const GET_ADD_QUALIFICATION = '[Admin] Get Add Qualification';
export const SET_ADD_QUALIFICATION = '[Admin] Set Add Qualification';

export class GetAddQualification implements Action {
  readonly type = GET_ADD_QUALIFICATION;
  constructor(public payload: Qualification) {}
}
export class SetAddQualification implements Action {
  readonly type = SET_ADD_QUALIFICATION;
  constructor(public payload: Qualification) {}
}

export const GET_UPDATE_QUALIFICATION = '[Admin] Get UPDATE Qualification';
export const SET_UPDATE_QUALIFICATION = '[Admin] Set UPDATE Qualification';

export class GetUPDATEQualification implements Action {
  readonly type = GET_UPDATE_QUALIFICATION;
  constructor(public payload: Qualification) {}
}
export class SetUPDATEQualification implements Action {
  readonly type = SET_UPDATE_QUALIFICATION;
  constructor(public payload: Qualification) {}
}

export const GET_ALL_FACILITY_TYPE = '[Admin] Get All Facility Type';
export const SET_ALL_FACILITY_TYPE = '[Admin] Set All Facility Type';

export class GetAllFacilityType implements Action {
  readonly type = GET_ALL_FACILITY_TYPE;
}
export class SetAllFacilityType implements Action {
  readonly type = SET_ALL_FACILITY_TYPE;
  constructor(public payload: FacilityType[]) {}
}

export const GET_ADD_FACILITY_TYPE = '[Admin] Get Add Facility Type';
export const SET_ADD_FACILITY_TYPE = '[Admin] Set Add Facility Type';

export class GetAddFacilityType implements Action {
  readonly type = GET_ADD_FACILITY_TYPE;
  constructor(public payload: FacilityType) {}
}
export class SetAddFacilityType implements Action {
  readonly type = SET_ADD_FACILITY_TYPE;
  constructor(public payload: FacilityType) {}
}

export const GET_UPDATE_FACILITY_TYPE = '[Admin] Get UPDATE Facility Type';
export const SET_UPDATE_FACILITY_TYPE = '[Admin] Set UPDATE Facility Type';

export class GetUPDATEFacilityType implements Action {
  readonly type = GET_UPDATE_FACILITY_TYPE;
  constructor(public payload: FacilityType) {}
}
export class SetUPDATEFacilityType implements Action {
  readonly type = SET_UPDATE_FACILITY_TYPE;
  constructor(public payload: FacilityType) {}
}


export const GET_ALL_FACILITY = '[Admin] Get All Facility ';
export const SET_ALL_FACILITY = '[Admin] Set All Facility ';

export class GetAllFacility implements Action {
  readonly type = GET_ALL_FACILITY;
}

export class SetAllFacility implements Action {
  readonly type = SET_ALL_FACILITY;
  constructor(public payload: Facility[]) {}
}

export const GET_FACILITY_TYPES = '[Admin] Get Facility Types ';
export const SET_FACILITY_TYPES = '[Admin] Set Facility Types';

export class GetFacilityTypes implements Action {
  readonly type = GET_FACILITY_TYPES;
}

export class SetFacilityTypes implements Action {
  readonly type = SET_FACILITY_TYPES;
  constructor(public payload: FacilityTypes[]) {}
}

export const GET_ADD_FACILITY = '[Admin] Get Add Facility';
export const SET_ADD_FACILITY = '[Admin] Set Add Facility';

export class GetAddFacility implements Action {
  readonly type = GET_ADD_FACILITY;
  constructor(public payload: Facility) {}
}

export class SetAddFacility implements Action {
  readonly type = SET_ADD_FACILITY;
  constructor(public payload: Facility) {}
}

export const GET_UPDATE_FACILITY = '[Admin] Get UPDATE Facility';
export const SET_UPDATE_FACILITY = '[Admin] Set UPDATE Facility';

export class GetUPDATEFacility implements Action {
  readonly type = GET_UPDATE_FACILITY;
  constructor(public payload: Facility) {}
}

export class SetUPDATEFacility implements Action {
  readonly type = SET_UPDATE_FACILITY;
  constructor(public payload: Facility) {}
}

export const GET_FACILITY_AREA = '[Admin] Get Facility Area ';
export const SET_FACILITY_AREA = '[Admin] Set Facility Area';

export class GetFacilityArea implements Action {
  readonly type = GET_FACILITY_AREA;
  constructor(public payload: number) {}
}

export class SetFacilityArea implements Action {
  readonly type = SET_FACILITY_AREA;
  constructor(public payload: FacilityArea[]) {}
}

export const GET_ADD_FACILITY_AREA = '[Admin] Get Add Facility Area';
export const SET_ADD_FACILITY_AREA = '[Admin] Set Add Facility Area';

export class GetAddFacilityArea implements Action {
  readonly type = GET_ADD_FACILITY_AREA;
  constructor(public payload: FacilityArea) {}
}

export class SetAddFacilityArea implements Action {
  readonly type = SET_ADD_FACILITY_AREA;
  constructor(public payload: FacilityArea) {}
}

export const GET_UPDATE_FACILITY_AREA = '[Admin] Get UPDATE Facility Area';
export const SET_UPDATE_FACILITY_AREA = '[Admin] Set UPDATE Facility Area';

export class GetUPDATEFacilityArea implements Action {
  readonly type = GET_UPDATE_FACILITY_AREA;
  constructor(public payload: FacilityArea) {}
}

export class SetUPDATEFacilityArea implements Action {
  readonly type = SET_UPDATE_FACILITY_AREA;
  constructor(public payload: FacilityArea) {}
}

export const GET_ALL_SHIFT_CATEGORY = '[Admin] Get All Shift Category ';
export const SET_ALL_SHIFT_CATEGORY = '[Admin] Set All Shift Category ';

export class GetAllShiftCategory implements Action {
  readonly type = GET_ALL_SHIFT_CATEGORY;
}

export class SetAllShiftCategory implements Action {
  readonly type = SET_ALL_SHIFT_CATEGORY;
  constructor(public payload: ShiftCategory[]) {}
}



export const GET_ADD_SHIFT_CATEGORY = '[Admin] Get Add Shift Category';
export const SET_ADD_SHIFT_CATEGORY = '[Admin] Set Add Shift Category';

export class GetAddShiftCategory implements Action {
  readonly type = GET_ADD_SHIFT_CATEGORY;
  constructor(public payload: ShiftCategory) {}
}

export class SetAddShiftCategory implements Action {
  readonly type = SET_ADD_SHIFT_CATEGORY;
  constructor(public payload: ShiftCategory) {}
}

export const GET_UPDATE_SHIFT_CATEGORY = '[Admin] Get UPDATE Shift Category';
export const SET_UPDATE_SHIFT_CATEGORY = '[Admin] Set UPDATE Shift Category';

export class GetUPDATEShiftCategory implements Action {
  readonly type = GET_UPDATE_SHIFT_CATEGORY;
  constructor(public payload: ShiftCategory) {}
}

export class SetUPDATEShiftCategory implements Action {
  readonly type = SET_UPDATE_SHIFT_CATEGORY;
  constructor(public payload: ShiftCategory) {}
}


export const GET_SYSTEM_SHIFT = '[Admin] Get System Shift ';
export const SET_SYSTEM_SHIFT = '[Admin] Set System Shift ';

export class GetSystemShift implements Action {
  readonly type = GET_SYSTEM_SHIFT;
}

export class SetSystemShift implements Action {
  readonly type = SET_SYSTEM_SHIFT;
  constructor(public payload: SystemShift[]) {}
}



export const GET_VIEW_SYSTEM_SHIFT = '[Admin] Get View System Shift';
export const SET_VIEW_SYSTEM_SHIFT = '[Admin] Set View System Shift';

export class GetViewSystemShift implements Action {
  readonly type = GET_VIEW_SYSTEM_SHIFT;
  constructor(public payload: number) {}
}

export class SetViewSystemShift implements Action {
  readonly type = SET_VIEW_SYSTEM_SHIFT;
  constructor(public payload: ViewSystemShift) {}
}

export type AdminActions =
  | Clear
  | GetUpdateEmployee
  | SetUpdateEmployee
  | GetAddNewEmployee
  | SetAddNewEmployee
  | GetEmailCheck
  | SetEmailCheck
  | GetInitialCheck
  | SetInitialCheck
  | GetAllEmployeesBasedOnUserId
  | SetAllEmployeesBasedOnUserId
  | GetAllActiveEmployeesBasedOnUserId
  | SetAllActiveEmployeesBasedOnUserId
  | GetAllRoles
  | SetAllRoles
  | GetAddRole
  | SetAddRole
  | GetUPDATERole
  | SetUPDATERole
  | GetActiveRoles
  | SetActiveRoles
  | GetPermissionsByRoleID
  | SetPermissionsByRoleID
  | GetAllActions
  | SetAllActions
  | GetAllPermissionsActionsModuleName
  | SetAllPermissionsActionsModuleName
  | GetUpdatePermissions
  | SetUpdatePermissions
  | GetAllQualification
  | SetAllQualification
  | GetAddQualification
  | SetAddQualification
  | GetUPDATEQualification
  | SetUPDATEQualification
  | GetAllFacilityType
  | SetAllFacilityType
  | GetAddFacilityType
  | SetAddFacilityType
  | GetUPDATEFacilityType
  | SetUPDATEFacilityType
  | GetAllFacility
  | SetAllFacility
  | GetFacilityTypes
  | SetFacilityTypes
  | GetAddFacility
  | SetAddFacility
  | GetUPDATEFacility
  | SetUPDATEFacility
  | GetFacilityArea
  | SetFacilityArea
  | GetAddFacilityArea
  | SetAddFacilityArea
  | GetUPDATEFacilityArea
  | SetUPDATEFacilityArea
  | GetAllShiftCategory
  | SetAllShiftCategory
  | GetAddShiftCategory
  | SetAddShiftCategory
  | GetUPDATEShiftCategory
  | SetUPDATEShiftCategory
  | GetSystemShift
  | SetSystemShift
  | GetViewSystemShift
  | SetViewSystemShift;
