import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/dashboard/admin/store/adminModel';
import { AddNewEmployee, Facility } from 'src/app/model/addNewEmployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url=location.origin+':2020'
  constructor(private http: HttpClient) {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.url='http://3.13.254.87:2020'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
        this.url='https://dev.straightlines.io/java'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this.url='https://test.straightlines.io/java'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this.url='https://staging.straightlines.io/java'
    }else{
      this.url='http://18.119.62.157:2020'
    }
  }
  addNewEmployee(new_emp): Observable<AddNewEmployee[]>{
    return this.http.post<AddNewEmployee[]>(this.url+'/employeedetails',new_emp)
  }
  leaveRequestSave(new_emp): Observable<AddNewEmployee[]>{
    return this.http.post<AddNewEmployee[]>(this.url+'/leaverequestsave',new_emp)
  }
  leaveRequestUpdate(new_emp,id): Observable<AddNewEmployee[]>{
    return this.http.put<AddNewEmployee[]>(this.url+'/leaverequestupdate/'+id,new_emp)
  }
  getLeaveRequestBasedonbidManagerId(empid): Observable<any>{
    return this.http.get<any>(this.url+'/leaverequesttobidmanagerid/'+empid)
  }
  getLeaveRequestBasedonEmpEd(empid): Observable<any>{
    return this.http.get<any>(this.url+'/leaverequestfromempid/'+empid)
  }

  getAllEmployee():Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeeall')
  }
  getAllEmployeeBasedOnUserId(userid):Observable<Employee[]>{
    return this.http.get<Employee[]>(this.url+'/employeelistwithareabasedonuserid/'+userid)
  }
  getEmployeeDetailBasedonEmpId(empid):Observable<Employee[]>{
    return this.http.get<Employee[]>(this.url+'/employeedetailbasedonempid/'+empid)
  }
  getFacilityAreaDropdown():Observable<any>{
    return this.http.get<any>(this.url+'/facilityareadropdown')
  }
  getAllEmployeeBasedOnUserIdWithStatus(userid,status):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeelistbasedonuserid/'+userid+'?status='+status)
  }
  getFacilityNamesBasedOnEmpAreaId(areaId):Observable<Facility>{
    return this.http.get<Facility>(this.url+'/getfacilitynamesbasedonempareaid/'+areaId)
  }
  checkEmpIsExistOrNot(managerid,initials):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeeinitialcheck?managerid='+managerid+'&initials='+initials)
  }
  getAllEmployeeBasedOnShiftlineAndBidScheduleName(shiftlineScheduleName,BidScheduleName):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/bidparamscheduleemployeelist/'+shiftlineScheduleName+'/'+BidScheduleName)
  }
  getAllEmployeeBasedOnQualification(selectedQualification):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeeinitialslist/'+selectedQualification)
  }
  getAllEmployeeBasedOnmanagerIdEmpInitials(managerId,empInitials):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeedetailsbasedoninitialsandmanagerid?managerid='+managerId+'&initials='+empInitials)
  }
  getEmpDataBasedOnEmpId(empID):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeedetailbasedonempid/'+empID)
  }
  checkDuplicateInitialName(initialName):Observable<AddNewEmployee[]>{
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }
    return this.http.get<AddNewEmployee[]>(this.url+'/employeeinitialexist/'+initialName,requestOptions)
  }
  updateAllEmp(empData):Observable<AddNewEmployee[]>{
    return this.http.put<AddNewEmployee[]>(this.url+'/employeedetailsupdate',empData)
  }
  updateEmpBasedOnId(empId,empData):Observable<AddNewEmployee[]>{
    return this.http.put<AddNewEmployee[]>(this.url+'/employeedetailsupdatebyempid/'+empId,empData)
  }
  deleteEmp(empId):Observable<AddNewEmployee[]>{
    return this.http.delete<AddNewEmployee[]>(this.url+'/employeedetailsdeletebybyempid/'+empId)
  }
  getAreaName(areaId):Observable<any>{
    return this.http.get<AddNewEmployee[]>(this.url+'/getareanamebasedonareaid/'+areaId)
  }
  getWorksheet(bischid,empid):Observable<any>{
    return this.http.get<AddNewEmployee[]>(this.url+'/worksheet/'+bischid+'/'+empid)
  }
  getManagerdetailsOfAnEmployee(empid):Observable<any>{
    return this.http.get<AddNewEmployee[]>(this.url+'/managerdetailsofanemployee/'+empid)
  }
}
