import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { BidWindow } from 'src/app/model/bidWindow';
@Injectable({
  providedIn: 'root'
})
export class BidWindowService {
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
    createNewBidSchedule(bidScheduleData): Observable<BidWindow[]>{
      return this.http.post<BidWindow[]>(this.url+'/bidwindowdurationpost',bidScheduleData)
    }

    getBidWindowData(bidScheduleId):Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/bidwindowdurationgetbybidschid/'+bidScheduleId)
    }
    getBidWindowDataBasedOnScheduleName(bidScheduleName):Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/bidwindowdurationgetbybidschname/'+bidScheduleName)
    }
    checkShiflineBidding(bId,eId,rId,status): Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/biddingbasedonshiftstatus?bidschId='+bId+'&empid='+eId+'&roundid='+rId+'&windowstatus='+status)
    }
    checkVacationBidding(bId,eId,rId,status): Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/biddingbasedonvacationstatus?bidschId='+bId+'&empid='+eId+'&roundid='+rId+'&windowstatus='+status)
    }

    getBidWindowDataBasedOnempId(empId):Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/bidwindowdurationgetbyempid/'+empId)
    }
    getBidscheduleDetailsBasedonEmpid(empId):Observable<BidWindow[]>{
      return this.http.get<BidWindow[]>(this.url+'/getbidscheduledetailsbasedonempid/'+empId)
    }

    updateBidWindowData(bidwindowId,bidWindowData):Observable<BidWindow[]>{
      return this.http.put<BidWindow[]>(this.url+'/bidwindowdurationupdatebyid/'+bidwindowId,bidWindowData)
    }
    deleteWindowTranData(id):Observable<BidWindow[]>{
      return this.http.delete<BidWindow[]>(this.url+'/bidwindowdurationdelete/'+id)
    }
}
