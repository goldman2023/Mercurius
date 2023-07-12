import * as AdminAction from './admin.actions';
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
  Week,
} from './adminModel';
import * as empService from 'src/app/services/employee/employee.service'
export interface adminState {
  role: Role[];
  activeEmloyees: Employee[];
  emloyees: Array<any>;
  updateSuccess: boolean;
  addSuccess: boolean;
  activeRoles: Role[];
  Permissions: PermissionsModel[];
  AllActions: ActionsObject[];
  ModuleNames: string[];
  permissionsData: moduleArraayModel[];
  Qualifications: Qualification[];
  FacilityType: FacilityType[];
  FacilityTypes: FacilityTypes[];
  Facility: Facility[];
  ShiftCategory: ShiftCategory[];
  FacilityArea: FacilityArea[];
  systemShift: SystemShift[];
  viewSystemShift: {} ;
  initalCheck: string;
  emailCheck: string;
  addEmployssSuccess: boolean;
  addUpdateSuccess: boolean;

}

const initialState: adminState = {
  activeEmloyees: [],
  emloyees: [],
  role: [],
  updateSuccess: false,
  addSuccess: false,
  activeRoles: [],
  Permissions: [],
  AllActions: [],
  ModuleNames: [],
  permissionsData: [],
  Qualifications: [],
  FacilityType: [],
  FacilityTypes: [],
  Facility: [],
  ShiftCategory: [],
  FacilityArea: [],
  systemShift: [],
  viewSystemShift: {},
  initalCheck: '',
  emailCheck: '',
  addEmployssSuccess: false,
  addUpdateSuccess: false,
};

export function adminReducer(
  state = initialState,
  action: AdminAction.AdminActions
) {
  switch (action.type) {
    case AdminAction.CLEAR: {
      return {
        ...state,
        updateSuccess: false,
        addSuccess: false,
      };
    }
    case AdminAction.SET_ADD_NEW_EMPLOYEE: {
      return {
        ...state,
        addEmployssSuccess : true,
        emloyees: state.emloyees.push(action.payload)
      };
    }
    case AdminAction.SET_UPDATE_EMPLOYEE: {
      return {
        ...state,
        addUpdateSuccess : true,
        updatedemloyees: state.emloyees.push(action.payload)
      };
    }
    case AdminAction.SET_ALL_EMPLOYEES_BASED_ON_USER_ID: {
      return {
        ...state,
        emloyees: action.payload
      };
    }
    case AdminAction.SET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID: {

      return {
        ...state,
        activeEmloyees: action.payload,
      };
    }
    case AdminAction.SET_ALL_ROLES: {
      let data = []
      action.payload.forEach( item =>{
        let itemObject = {
          id : item.id,
          role_name: item.role_name.trim(),
          status: item.status ,
          updated_by: item.updated_by,
          updated_date: item.updated_date,
          created_by: item.created_by,
          created_date: item.created_date,
          end_date: item.end_date,
          start_date: item.start_date,
        }
        data.push(itemObject)
      })
      return {
        ...state,
        role: data,
      };
    }
    case AdminAction.SET_ACTIVE_ROLES: {
      return {
        ...state,
        activeRoles: action.payload,
      };
    }
    case AdminAction.SET_ADD_ROLE: {
      return {
        ...state,
        ...[state.role.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }
    case AdminAction.SET_UPDATE_ROLE: {
      let roleIndex = state.role.findIndex((x) => x.id === action.payload.id);
      return {
        ...state,
        ...state.role.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }
    case AdminAction.SET_PERMISSIONS_BY_ROLE_ID: {
      return {
        ...state,
        Permissions: action.payload,
      };
    }
    case AdminAction.SET_All_ACTIONS: {
      let array: ActionsObject[] = [];
      action.payload.AllActions.forEach((item) => {
        let createArra: ActionsObject = {
          permission_id: item.p_id,
          modu_name: item.modu_name,
          act_name: item.act_name,
          t_id: 0,
          role_id: action.payload.role_id,
          status: false,
          func_name: item.func_name,
        };
        array.push(createArra);
      });
      return {
        ...state,
        AllActions: array,
      };
    }

    case AdminAction.SET_All_PERMISSIONS_ACTION_MODULE_NAME: {
      let module_names: moduleArraayModel[] = [];
      let actions: ActionsObject[] = [];

      state.AllActions.map((item) => {
        state.Permissions.map(function (item2) {
          if (item.permission_id == item2.permission_id) {
            (item.t_id = item2.t_id), (item.status = item2.status);
          }
        });
      });

      action.payload.forEach((item) => {
        let names: moduleArraayModel = {
          modu_name: item,
          actions: [],
        };
        module_names.push(names);
      });
      let mergedarray = module_names.map((item) => {
        state.AllActions.map(function (item2) {
          if (item.modu_name == item2.modu_name) {
            item.actions.push(item2);
          }
        });
        return item;
      });
      let mergedDataWithSubModuleName = mergedarray.map(item => {
        const uniqueFuncNames = Array.from(new Set(item.actions.map(detail => detail.func_name)));
        let result = {
          modu_name: item.modu_name,
          actions: []
        };
        for (let i = 0; i < uniqueFuncNames.length; i++) {
          const details = item.actions.filter(detail => detail.func_name === uniqueFuncNames[i]);
          result.actions.push({
            permission_id: details[0].permission_id,
            modu_name: details[0].modu_name,
            act_name: details[0].act_name,
            t_id: details[0].t_id,
            role_id: details[0].role_id,
            status: details[0].status,
            func_name: uniqueFuncNames[i],
            func_name_arry: details
          });
        }
        return result;
      });
      return {
        ...state,
        permissionsData: mergedDataWithSubModuleName,
      };
    }

    case AdminAction.SET_ALL_QUALIFICATION: {
      let qualificationDataArray = []
      action.payload.forEach( item => {

        let qualificationData = {
          id: item.id,
          qual_name: item.qual_name.trim(),
          qual_description: item.qual_description.trim(),
          eff_start_date: item.eff_start_date,
          eff_end_date: item.eff_end_date,
          qual_created_by: item.qual_created_by,
          qual_created_date: item.qual_created_date,
          qual_updated_date: item.qual_updated_date,
          qual_updated_by: item.qual_updated_by,
          status: item.status
        }
        qualificationDataArray.push(qualificationData)
      })
      return {
        ...state,
        Qualifications: qualificationDataArray,
      };
    }
    case AdminAction.SET_ADD_QUALIFICATION: {
      return {
        ...state,
        ...[state.Qualifications.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }
    case AdminAction.SET_UPDATE_QUALIFICATION: {
      let roleIndex = state.Qualifications.findIndex(
        (x) => x.id === action.payload.id
      );

      return {
        ...state,
        ...state.Qualifications.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }

    case AdminAction.SET_ALL_FACILITY_TYPE: {
      let facilityTypeArray = [];
      action.payload.forEach(item => {
        let facilityTypeObject = {
          facilitytype_name : item.facilitytype_name.trim(),
          facilitytype_id : item.facilitytype_id,
          created_by : item.created_by,
          created_date : item.created_date,
          end_date : item.end_date,
          facilitytype_desc : item.facilitytype_desc.trim(),
          start_date : item.start_date,
          status : item.status,
          updated_by : item.updated_by,
          updated_date : item.updated_date,
        }
        facilityTypeArray.push(facilityTypeObject)
      })
      return {
        ...state,
        FacilityType: facilityTypeArray,
      };
    }

    case AdminAction.SET_ADD_FACILITY_TYPE: {
      return {
        ...state,
        ...[state.FacilityType.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }
    case AdminAction.SET_UPDATE_FACILITY_TYPE: {
      let roleIndex = state.FacilityType.findIndex(
        (x) => x.facilitytype_id === action.payload.facilitytype_id
      );

      return {
        ...state,
        ...state.FacilityType.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }

    case AdminAction.SET_ALL_FACILITY: {
      let facilityArray = [];
      action.payload.forEach( item => {
        let facilityObject = {
          facilityname: item.facilityname.trim(),
          created_by: item.created_by,
          created_date: item.created_date,
          end_date: item.end_date,
          facilityabbr: item.facilityabbr.trim(),
          facilitycity: item.facilitycity.trim(),
          facilityid: item.facilityid,
          facilitystate: item.facilitystate,
          facilitytypeidref: item.facilitytypeidref,
          facilitytypenameref: item.facilitytypenameref,
          start_date: item.start_date,
          status: item.status,
          updated_by: item.updated_by,
          updated_date: item.updated_date,
        }
        facilityArray.push(facilityObject)
      })
      return {
        ...state,
        Facility: facilityArray,
      };
    }

    case AdminAction.SET_ADD_FACILITY: {
      return {
        ...state,
        ...[state.Facility.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }

    case AdminAction.SET_FACILITY_TYPES: {
      return {
        ...state,
        FacilityTypes: action.payload,
      };
    }

    case AdminAction.SET_UPDATE_FACILITY: {
      let roleIndex = state.Facility.findIndex(
        (x) => x.facilityid === action.payload.facilityid
      );

      return {
        ...state,
        ...state.Facility.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }

    case AdminAction.SET_ADD_FACILITY_AREA: {
      return {
        ...state,
        ...[state.FacilityArea.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }
    case AdminAction.SET_INITIALS_CHECK: {
      return {
        ...state,
        initalCheck: action.payload,
      };
    }
    case AdminAction.SET_EMAIL_CHECK: {
      return {
        ...state,
        emailCheck: action.payload,
      };
    }

    case AdminAction.SET_FACILITY_AREA: {
      return {
        ...state,
        FacilityArea: action.payload,
      };
    }

    case AdminAction.SET_UPDATE_FACILITY_AREA: {
      let roleIndex = state.FacilityArea.findIndex(
        (x) => x.areaid === action.payload.areaid
      );

      return {
        ...state,
        ...state.FacilityArea.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }

    case AdminAction.SET_ALL_SHIFT_CATEGORY: {
      let shiftCategoryArray = [];
      action.payload.forEach(item => {
        let shiftCateforyObject = {
          shcategory_name: item.shcategory_name.trim(),
          created_by: item.created_by,
          created_date: item.created_date,
          end_date: item.end_date,
          shcategory_id: item.shcategory_id,
          start_date: item.start_date,
          status: item.status,
          updated_by: item.updated_by,
          updated_date: item.updated_date,
        }
        shiftCategoryArray.push(shiftCateforyObject)
      })
      return {
        ...state,
        ShiftCategory: shiftCategoryArray,
      };
    }

    case AdminAction.SET_ADD_SHIFT_CATEGORY: {
      return {
        ...state,
        ...[state.ShiftCategory.splice(0, 0, action.payload)],
        addSuccess: true,
      };
    }
    case AdminAction.SET_UPDATE_SHIFT_CATEGORY: {
      let roleIndex = state.ShiftCategory.findIndex(
        (x) => x.shcategory_id === action.payload.shcategory_id
      );

      return {
        ...state,
        ...state.ShiftCategory.splice(roleIndex, 1, action.payload),
        updateSuccess: true,
      };
    }

    case AdminAction.SET_SYSTEM_SHIFT: {
      let systemShiftArray = [];
      action.payload.forEach(item => {
        let systemShiftObject = {
          shiftName: item.shiftName.trim(),
          id: item.id,
          sh_include_exclude: item.shiftIncludeExclude,
          shiftDuration: item.shiftDuration,
          shiftCategoryName: item.shiftCategoryName.trim(),
          shiftCategory: item.shiftCategory,
          startTime: item.startTime,
        }
        systemShiftArray.push(systemShiftObject)
      })
      return {
        ...state,
        systemShift: systemShiftArray,
      };
    }
    case AdminAction.SET_VIEW_SYSTEM_SHIFT: {


      return {
        ...state,
        viewSystemShift: action.payload,
      };
    }
    default:
      return state;
  }

  // let data = {
  //   permission_id :1,
  //   modu_name:"Generate Schedule",
  //   act_name:"Add New Shiftline Schedule",
  //   t_id:380,
  //   role_id:1,
  //   status:true,
  //   func_name:'Manage ShiftLines Schedule',
  //   func_name_arry:[
  //     {
  //       permission_id :1,
  //   modu_name:"Generate Schedule",
  //   act_name:"Add New Shiftline Schedule",
  //   t_id:380,
  //   role_id:1,
  //   status:true,
  //   func_name:'Manage ShiftLines Schedule',
  //     },
  //     {
  //       permission_id :1,
  //   modu_name:"Generate Schedule",
  //   act_name:"Add New Shiftline Schedule",
  //   t_id:380,
  //   role_id:1,
  //   status:true,
  //   func_name:'Manage ShiftLines Schedule',
  //     },
  //     {
  //       permission_id :1,
  //   modu_name:"Generate Schedule",
  //   act_name:"Add New Shiftline Schedule",
  //   t_id:380,
  //   role_id:1,
  //   status:true,
  //   func_name:'Manage ShiftLines Schedule',
  //     },
  //   ]
  // }
}
