import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { AddNewEmployee } from 'src/app/model/addNewEmployee';
@Injectable({
  providedIn: 'root'
})
export class AddNewEmployeeService {
  private _url:string=straightlines_io_java_apis.java_apis.url
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

  getAllEmployee():Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url+'/employeeall')
  }
  getAllEmployeeBasedOnUserId(userid):Observable<AddNewEmployee[]>{
    return this.http.get<AddNewEmployee[]>(this.url + '/employeelistbasedonuserid/' + userid + '?status=1')
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
  getEmpDataBasedOnEmpId(empID):Observable<AddNewEmployee>{
    return this.http.get<AddNewEmployee>(this.url+'/employeedetailbasedonempid/'+empID)
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
  updateEmpStatusBasedOnId(empId, statusData): Observable<AddNewEmployee[]> {
    return this.http.put<AddNewEmployee[]>(this.url + `/employeestatuschange/${empId}?status=${statusData}`, statusData)
  }
  deleteEmp(empId):Observable<AddNewEmployee[]>{
    return this.http.delete<AddNewEmployee[]>(this.url+'/employeedetailsdeletebybyempid/'+empId)
  }
}
