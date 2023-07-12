export interface Role {
  id: number;
  role_name: string;
  start_date: Date;
  end_date: Date;
  created_date: Date;
  created_by: string;
  updated_by: string;
  updated_date: Date;
  status: string;
}

export interface PermissionsModel {
  t_id: number;
  role_id: number;
  permission_id: number;
  status: boolean;
  modu_name: string;
  act_name: string;
  func_name: string;
}

export interface moduleArraayModel {
  modu_name: any;
  actions: ActionsObject[];
}

export interface ActionsObject {
  t_id: number;
  role_id: number;
  permission_id: number;
  status: boolean;
  modu_name: string;
  act_name: string;
  func_name: string;
}

export interface Qualification {
  id: number;
  qual_name: string;
  qual_description: string;
  eff_start_date: string;
  eff_end_date: string;
  qual_created_by: number;
  qual_created_date: string;
  qual_updated_by: number;
  qual_updated_date: string;
  status: boolean;
}
export interface FacilityType {
  facilitytype_id: number;
  facilitytype_name: string;
  facilitytype_desc: string;
  start_date: string;
  end_date: string;
  created_by: number;
  created_date: string;
  updated_by: number;
  updated_date: string;
  status: boolean;
}

export interface Facility {
  facilityid: number;
  facilityabbr: string;
  facilityname: string;
  facilitycity: string;
  facilitystate: string;
  facilitytypeidref: number;
  facilitytypenameref: string;
  start_date: string;
  end_date: string;
  created_by: number;
  created_date: string;
  updated_by: number;
  updated_date: string;
  status: boolean;
}

export interface FacilityTypes {
  facilitytypeidref: number;
  facilitytypenameref: string;
  facilitytype_id: number;
  facilitytype_name: string;
}

export interface ShiftCategory {
  shcategory_id: number;
  shiftCategory: number;
  shcategory_name: string;
  start_date: string;
  end_date: string;
  created_by: number;
  created_date: string;
  updated_by: number;
  updated_date: string;
  status: boolean;
}
export interface SystemShift {
  id: number;
  shiftName: string;
  shiftIncludeExclude: string;
  shiftDuration: string;
  shiftCategoryName: string;
  shiftCategory: number;
  startTime: number;
}
export interface ViewSystemShift {
  sh_def_id: number;
  shiftName: string;
  sh_include_exclude: string;
  shift_duration: string;
  shiftcategory_name: string;
  startTime: number;
  week: Week
}

export interface Week {
  day: string;
  value: string;

}
export interface FacilityArea {
  areaid: number;
  areaname: string;
  areadescription: string;
  start_date: string;
  end_date: string;
  created_by: number;
  created_date: string;
  updated_by: number;
  updated_date: string;
  status: boolean;
}
export interface Employee {
  areaid: number;
  areaName: string;
  facilityName: string;
  empid: number;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  qualification: string;
  role: number;
  managerid: number;
  rank: number;
  vacation: number;
  accumulatedleave: number;
  emailsent: number;
  status: boolean;
}
