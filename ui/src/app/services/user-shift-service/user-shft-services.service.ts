import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserShftServicesService {
  private url=location.origin+':2020'
  private _url=location.origin+':5000'
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

      this._url='https://dev.straightlines.io/python'
  }
  GetShiftDefinitionByUserID(userId): Observable<any>{
    return this.http.get<any>(this.url+'/shiftdefinitionbyuserid/'+userId)
  }
  updateShiftDefinitionByUserID( data): Observable<any>{
    return this.http.put<any>(this.url+'/shiftdefinition/'+data.sh_id, data)
  }
  AddShiftDefinitionByUserID( data): Observable<any>{
    return this.http.post<any>(this.url+'/shiftdefinition', data)
  }
  getAreaNames(): Observable<any>{
    return this.http.get<any>(this.url+'/getareanames')
  }
  getAllShiftCategoryNames(): Observable<any>{
    return this.http.get<any>(this.url+'/getallshiftcategorynames')
  }
  checkShiftLine(created_by,shiftname,shiftduration,shiftstarttime): Observable<any>{
    return this.http.get<any>(this.url+'/checkinbothdefinitionstable?created_by='+created_by+'&shiftname='+shiftname+'&shiftduration='+shiftduration+'&shiftstarttime='+shiftstarttime)
  }
  checkShiftDuration(created_by, shiftstarttime, shiftduration, areaid): Observable<any>{
    return this.http.get<any>(this.url + '/checkinbothdefinitionstable?createdby='+created_by + '&shiftstarttime='+shiftstarttime+'&shiftduration='+shiftduration+'&areaid='+areaid)
  }

  checkAliasByUserId(userId): Observable<any>{
    return this.http.get<any>(this.url + '/shiftdefbyaliasname/' + userId);
  }
}
