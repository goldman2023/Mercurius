import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, exhaustMap, catchError } from 'rxjs/operators';


import * as AdminActions from './admin.actions';
import {
  ActionsObject,
  Employee,
  Facility,
  FacilityArea,
  FacilityType,
  FacilityTypes,
  PermissionsModel,
  Qualification,
  Role,
  ShiftCategory,
  SystemShift,
  ViewSystemShift,
} from './adminModel';
import * as appReducer from './../../../store/app.reducers';
import moment from 'moment';
import { SharedDataService } from '../shared-data.service';
import { AlertController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AdminEffects {
  basedUrl
  user_data
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<appReducer.AppState>,
    private sharedService : SharedDataService,
    public alertController: AlertController,
    private loginSer: LoginService,
  ) {
    this.basedUrl = this.sharedService.baseUrl()
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
  }


  @Effect()
  GetAllEmployeesBasedOnUserId = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_EMPLOYEES_BASED_ON_USER_ID),
    switchMap((action: AdminActions.GetAllEmployeesBasedOnUserId) => {
      return this.http.get<any>(`${this.basedUrl}/employeelistbasedonmanagerid/${action.payload}`).pipe(
        map((resData) => {
          return new AdminActions.SetAllEmployeesBasedOnUserId(resData);
        })
      );
    })
  );
  @Effect()
  GetAddNewEmployee = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_NEW_EMPLOYEE),
    switchMap((action: AdminActions.GetAddNewEmployee) => {
      return this.http.post<any>(`${this.basedUrl}/employeedetails/`,action.payload).pipe(
        map((resData) => {
          return new AdminActions.SetAddNewEmployee(resData);
        })
      );
    })
  );
  @Effect()
  GetUpdateEmployee = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_EMPLOYEE),
    switchMap((action: AdminActions.GetUpdateEmployee) => {
      return this.http.put<any>(`${this.basedUrl}/employeedetailsupdatebyempid/${action.payload.empDetails.empid}`,action.payload.empDetails).pipe(
        map((resData) => {
          return new AdminActions.SetUpdateEmployee(resData);
        })
      );
    })
  );

  @Effect()
  GetAllActiveEmployeesBasedOnUserId = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_ACTIVE_EMPLOYEES_BASED_ON_USER_ID),
    switchMap((action: AdminActions.GetAllActiveEmployeesBasedOnUserId) => {
      return this.http.get<Array<Employee>>(`${this.basedUrl}/employeelistbasedonuserid/${action.payload.userId}?status=${action.payload.status}`).pipe(
        map((resData) => {
          return new AdminActions.SetAllActiveEmployeesBasedOnUserId(resData);
        })
      );
    })
  );

  @Effect()
  GetAllroles = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_ROLES),
    switchMap(() => {
      return this.http.get<Role[]>(`${this.basedUrl}/getallroledetails`).pipe(
        map((resData) => {
          return new AdminActions.SetAllRoles(resData);
        })
      );
    })
  );
  @Effect()
  GetInitialCheck = this.actions$.pipe(
    ofType(AdminActions.GET_INITIALS_CHECK),
    switchMap((action: AdminActions.GetInitialCheck) => {
      return this.http.get<any>(`${this.basedUrl}/employeeinitialcheck?managerid=${action.payload.managerid}&initials=${action.payload.initial}`).pipe(
        map((resData) => {
          return new AdminActions.SetInitialCheck(resData);
        })
      );
    })
  );
  @Effect()
  GetEmailCheck = this.actions$.pipe(
    ofType(AdminActions.GET_EMAIL_CHECK),
    switchMap((action: AdminActions.GetEmailCheck) => {
      const emailCheck = {
        username : action.payload.Email
      }
      return this.http.get<any>(`${this.basedUrl}/employeeemailexist/${action.payload.Email}`).pipe(
        map((resData) => {
          return new AdminActions.SetEmailCheck(resData);
        })
      );
    })
  );


  @Effect()
  addNewRole = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_ROLE),
    switchMap((action: AdminActions.GetAddRole) => {
      return this.http
        .post<Role>(`${this.basedUrl}/saveroledetails`, action.payload)
        .pipe(
          map((data) => {
            return new AdminActions.SetAddRole(data);
          })
        );
    })
  );

  @Effect()
  UPDATERole = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_ROLE),
    switchMap((action: AdminActions.GetUPDATERole) => {
      const data = {
        role_name: action.payload.role_name.trim(),
        start_date: moment(action.payload.start_date).format('YYYY-MM-DD'),
        end_date: moment(action.payload.end_date).format('YYYY-MM-DD'),
        updated_by: action.payload.updated_by,
        created_by: action.payload.created_by,
        created_date: action.payload.created_date,
        id: action.payload.id,
      };
      return this.http
        .put<Role>(`${this.basedUrl}/updateroledetails/${action.payload.id}`, data)
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATERole(data);
          })
        );
    })
  );


  @Effect()
  GetActiveroles = this.actions$.pipe(
    ofType(AdminActions.GET_ACTIVE_ROLES),
    switchMap(() => {
      return this.http.get<Role[]>(`${this.basedUrl}/activeroles/Active`).pipe(
        map((resData) => {
          this.store.dispatch(
            new AdminActions.GetPermissionsByRoleID(resData[0].id)
          );
          return new AdminActions.SetActiveRoles(resData);
        })
      );
    })
  );


  @Effect()
  GetPermissionsByRoleId = this.actions$.pipe(
    ofType(AdminActions.GET_PERMISSIONS_BY_ROLE_ID),
    switchMap((action: AdminActions.GetPermissionsByRoleID) => {
      return this.http
        .get<PermissionsModel[]>(
          `${this.basedUrl}/getactionbasedonroleid/${action.payload}`
        )
        .pipe(
          map((resData) => {
            this.store.dispatch(new AdminActions.GetAllActions(action.payload));
            return new AdminActions.SetPermissionsByRoleID(resData);
          })
        );
    })
  );


  @Effect()
  GetAllActions = this.actions$.pipe(
    ofType(AdminActions.GET_All_ACTIONS),
    switchMap((action: AdminActions.GetAllActions) => {
      return this.http.get<ActionsObject[]>(`${this.basedUrl}/allactions`).pipe(
        map((resData) => {
          this.store.dispatch(
            new AdminActions.GetAllPermissionsActionsModuleName()
          );
          return new AdminActions.SetAllActions({
            AllActions: resData,
            role_id: action.payload,
          });
        })
      );
    })
  );


  @Effect()
  GetAllPermissionsActionsModuleName = this.actions$.pipe(
    ofType(AdminActions.GET_All_PERMISSIONS_ACTION_MODULE_NAME),
    switchMap((action: AdminActions.GetAllPermissionsActionsModuleName) => {
      return this.http.get<[]>(`${this.basedUrl}/getmodulenames`).pipe(
        map((resData) => {
          return new AdminActions.SetAllPermissionsActionsModuleName(resData);
        })
      );
    })
  );


  @Effect()
  GetUpdatePermissions = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_PERMISSIONS),
    exhaustMap((action: AdminActions.GetUpdatePermissions) => {
      return this.http
        .post<Actions[]>(`${this.basedUrl}/addroleswithmodule`, action.payload)
        .pipe(
          switchMap(async (resData) => {
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Success',
              message: "Permissions Updated Successfully!",
              buttons: ['OK']
            });
            this.loginSer.getUserDetails(this.user_data.id, this.user_data.role_id_ref).subscribe(userDetails => {
              this.user_data.permissionDetails = userDetails.permissionDetails;
              sessionStorage.setItem('userData', JSON.stringify(this.user_data));
            });
  
            await alert.present();
            return new AdminActions.SetUpdatePermissions(resData);
          }),
          catchError((error) => {
            console.log('Error occurred', error);
            return error;
          })
        );
    })
  );
  


  @Effect()
  GetAllQualification = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_QUALIFICATION),
    switchMap(() => {
      return this.http
        .get<Qualification[]>(`${this.basedUrl}/employeequalification`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetAllQualification(resData);
          })
        );
    })
  );


  @Effect()
  addNewQualification = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_QUALIFICATION),
    switchMap((action: AdminActions.GetAddQualification) => {
      return this.http
        .post<Qualification>(
          `${this.basedUrl}/qualificationdetailssave`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetAddQualification(data);
          })
        );
    })
  );


  @Effect()
  UPDATEQualification = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_QUALIFICATION),
    switchMap((action: AdminActions.GetUPDATEQualification) => {
      const data = {
        eff_end_date: moment(action.payload.eff_end_date).format('YYYY-MM-DD'),
        eff_start_date: moment(action.payload.eff_start_date).format(
          'YYYY-MM-DD'
        ),
        qual_created_by: action.payload.qual_created_by,
        qual_created_date: action.payload.qual_created_date,
        qual_description: action.payload.qual_description,
        qual_name: action.payload.qual_name,
        qual_updated_by: action.payload.qual_updated_by,
        qual_updated_date: action.payload.qual_updated_date,
        status: action.payload.status,
        id: action.payload.id,
      };
      return this.http
        .put<Qualification>(
          `${this.basedUrl}/qualificationdetailsupdate/${action.payload.id}`,
          data
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATEQualification(data);
          })
        );
    })
  );


  @Effect()
  GetAllFacilityType = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_FACILITY_TYPE),
    switchMap(() => {
      return this.http
        .get<FacilityType[]>(`${this.basedUrl}/getallfacilitytypedetails`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetAllFacilityType(resData);
          })
        );
    })
  );


  @Effect()
  addNewFacilityType = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_FACILITY_TYPE),
    switchMap((action: AdminActions.GetAddFacilityType) => {
      return this.http
        .post<FacilityType>(
          `${this.basedUrl}/savefacilitytypedetails`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetAddFacilityType(data);
          })
        );
    })
  );


  @Effect()
  UPDATEFacilityType = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_FACILITY_TYPE),
    switchMap((action: AdminActions.GetUPDATEFacilityType) => {
      return this.http
        .put<FacilityType>(
          `${this.basedUrl}/updatefacilitytypedetails/${action.payload.facilitytype_id}`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATEFacilityType(data);
          })
        );
    })
  );




  @Effect()
  GetFacilityTypes = this.actions$.pipe(
    ofType(AdminActions.GET_FACILITY_TYPES),
    switchMap(() => {
      return this.http
        .get<FacilityTypes[]>(`${this.basedUrl}/getallfacilitytypenames`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetFacilityTypes(resData);
          })
        );
    })
  );


  @Effect()
  GetAllFacility = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_FACILITY),
    switchMap(() => {
      return this.http
        .get<Facility[]>(`${this.basedUrl}/getallfacilitystates`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetAllFacility(resData);
          })
        );
    })
  );


  @Effect()
  addNewFacility = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_FACILITY),
    switchMap((action: AdminActions.GetAddFacility) => {
      return this.http
        .post<Facility>(
          `${this.basedUrl}/savefacilitystatedetails`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetAddFacility(data);
          })
        );
    })
  );


  @Effect()
  UPDATEFacility = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_FACILITY),
    switchMap((action: AdminActions.GetUPDATEFacility) => {
      return this.http
        .put<Facility>(
          `${this.basedUrl}/updatefacilitystatedetails/${action.payload.facilityid}`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATEFacility(data);
          })
        );
    })
  );


  @Effect()
  GetAllFacilityArea = this.actions$.pipe(
    ofType(AdminActions.GET_FACILITY_AREA),
    switchMap((action: AdminActions.GetFacilityArea) => {
      return this.http
        .get<FacilityArea[]>(`${this.basedUrl}/getareanamesforfacilityid/${action.payload}`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetFacilityArea(resData);
          })
        );
    })
  );


  @Effect()
  addNewFacilityArea = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_FACILITY_AREA),
    switchMap((action: AdminActions.GetAddFacilityArea) => {
      return this.http
        .post<FacilityArea>(
          `${this.basedUrl}/saveareadetails`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetAddFacilityArea(data);
          })
        );
    })
  );


  @Effect()
  UPDATEFacilityArea = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_FACILITY_AREA),
    switchMap((action: AdminActions.GetUPDATEFacilityArea) => {
      return this.http
        .put<FacilityArea>(
          `${this.basedUrl}/updateareadetails/${action.payload.areaid}`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATEFacilityArea(data);
          })
        );
    })
  );

  @Effect()
  GetAllShiftCategory = this.actions$.pipe(
    ofType(AdminActions.GET_ALL_SHIFT_CATEGORY),
    switchMap(() => {
      return this.http
        .get<ShiftCategory[]>(`${this.basedUrl}/getallshiftcategorydetails`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetAllShiftCategory(resData);
          })
        );
    })
  );


  @Effect()
  addNewShiftCategory = this.actions$.pipe(
    ofType(AdminActions.GET_ADD_SHIFT_CATEGORY),
    switchMap((action: AdminActions.GetAddShiftCategory) => {
      return this.http
        .post<ShiftCategory>(
          `${this.basedUrl}/saveshiftcategorydetails`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetAddShiftCategory(data);
          })
        );
    })
  );


  @Effect()
  UPDATEShiftCategory = this.actions$.pipe(
    ofType(AdminActions.GET_UPDATE_SHIFT_CATEGORY),
    switchMap((action: AdminActions.GetUPDATEShiftCategory) => {
      return this.http
        .put<ShiftCategory>(
          `${this.basedUrl}/updateshiftcategorydetails/${action.payload.shcategory_id}`,
          action.payload
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetUPDATEShiftCategory(data);
          })
        );
    })
  );

  @Effect()
  GetSystemShitf = this.actions$.pipe(
    ofType(AdminActions.GET_SYSTEM_SHIFT),
    switchMap(() => {
      return this.http
        .get<SystemShift[]>(`${this.basedUrl}/getallsystemdef`)
        .pipe(
          map((resData) => {
            return new AdminActions.SetSystemShift(resData);
          })
        );
    })
  );


  @Effect()
  viewSystemShift = this.actions$.pipe(
    ofType(AdminActions.GET_VIEW_SYSTEM_SHIFT),
    switchMap((action: AdminActions.GetViewSystemShift) => {
      return this.http
        .get<ViewSystemShift>(
          `${this.basedUrl}/getsystemdefshiftdefbyid/${action.payload}`
        )
        .pipe(
          map((data) => {
            return new AdminActions.SetViewSystemShift(data);
          })
        );
    })
  );

}
