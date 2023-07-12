import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddNewEmployee } from 'src/app/model/addNewEmployee';

@Injectable({
  providedIn: 'root'
})
export class PayPeriodService {

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

  addNewPayPeriodPost(new_emp): Observable<any>{
    return this.http.post<any>(this.url+'/payperiodpost',new_emp)
  }
  updatePayPeriod(new_emp): Observable<any>{
    return this.http.put<any>(this.url+'/payperiodpost',new_emp)
  }
  getAllPayPeriod(year): Observable<any>{
    return this.http.get<any>(this.url+'/payperiodbyyear/'+year)
  }
  addNewEmployeeNotes(data): Observable<any>{
    return this.http.post<any>(this.url+'/employeenotes',data)
  }
  getAllEmployeeNotes(empId, managerid): Observable<any>{
    return this.http.get<any>(this.url+'/employeenotes/'+empId+'/'+managerid)
  }
  getAllEmployeeNotesByDateAndEmpId(empId, submitforDate): Observable<any>{
    return this.http.get<any>(this.url+'/employeenotes?empid='+empId+'&submittedfordate='+submitforDate)
  }
  getAllEmployeeNotesByEmpId(empId): Observable<any>{
    return this.http.get<any>(this.url+'/employeenotes/'+empId)
  }
  updatePayperiodUpdateMore(data): Observable<any>{
    return this.http.put<any>(this.url+'/payperiodupdatemore/', data)
  }
  updateEmployeeNotes(data): Observable<any>{
    return this.http.put<any>(this.url+'/employeenotes/', data)
  }
  deleteEmployeeNotes(empId,submittedfordate ): Observable<any>{
    return this.http.delete<any>(this.url+'/employeedetailsdeletebybyempidandsubmiteeddate?empid='+empId+'&submittedfordate='+submittedfordate,)
  }
  deleteEmployeeNoteByNoteId(noteId ): Observable<any>{
    return this.http.delete<any>(this.url+'/employeedetailsdeletebybynotesid/'+noteId,)
  }
}
