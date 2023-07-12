import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageScheduleService {

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
  bidScheduleList(userId,summaryEmail):Observable<any>{
    return this.http.get<any>(this.url+'/bidschedulesbyuseridandschedulestatus/'+userId+'/'+summaryEmail,)
  }
  GetBidParamgetAllEmpIdBasedonBidschId(bidschid):Observable<any>{
    return this.http.get<any>(this.url+'/employeelistbasedonbidscheduleid/'+bidschid)
  }
  basicWatchSchedule(bidscheduleid,shiftdate):Observable<any>{
    return this.http.get<any>(this.url+'/basicwatch/'+bidscheduleid+'/'+shiftdate,)
  }
  getWorkForceBasedOnShiftLineScheduleDayAndId(day,id):Observable<any>{
    return this.http.get<any>(this.url+'/getworkforcebasedonshiftlinescheduledayandid/'+day+'/'+id,)
  }
  getWorkForceBasedOnShiftLineScheduleDateRangeAndId(from, to, id): Observable<any>{
    return this.http.get<any>(this.url +'/basicwatch/'+id+'/daterange?from='+from+'&to='+to,)
  }
  getWeeklyBasicWatchVacation(from, to, id): Observable<any>{
    return this.http.get<any>(this.url +'/basicwatchvacation/'+id+'/daterange?from='+from+'&to='+to,)
  }
  basicWatchVacation(id, date): Observable<any>{
    return this.http.get<any>(this.url +'/basicwatchvacation/'+id+'?shiftdate='+date)
  }
  
  checkPayperiodAndBusinessRule(data): Observable<any>{
    return this.http.post<any>(this.url + '/check_payperiod', data);
    
  }
}
