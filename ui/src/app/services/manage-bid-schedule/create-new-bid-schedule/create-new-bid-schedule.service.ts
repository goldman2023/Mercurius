import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { CreateNewBidSchedule } from 'src/app/model/createNewBidSchedule';
@Injectable({
  providedIn: 'root'
})
export class CreateNewBidScheduleService {

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
  checkBidScheduleName(newBidSchedule,userId): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/bidschedulenamecheck?bidschedulename='+newBidSchedule+'&managerid='+userId,)
  }
  createNewBidSchedule(bidScheduleData): Observable<CreateNewBidSchedule[]>{
    return this.http.post<CreateNewBidSchedule[]>(this.url+'/bidparampost',bidScheduleData)
  }
  getAllBidScheduleData(userId): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/bidparambasedonloggeduserid/'+userId)
  }
  getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/bidparamget/'+bidScheduleId)
  }
  updateBidSchedule(bidScheduleId,bidScheduleData):Observable<CreateNewBidSchedule[]>{
    return this.http.put<CreateNewBidSchedule[]>(this.url+'/bidparamput/'+bidScheduleId,bidScheduleData)
  }

  deleteBidSchedule(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    this.deletenullvalue(0)
    return this.http.delete<CreateNewBidSchedule[]>(this.url+'/bidparamdelete/'+bidScheduleId)
  }
  deleteAllDataBasedOnBidScheduleId(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    this.deletenullvalue(0)
    return this.http.delete<CreateNewBidSchedule[]>(this.url+'/biddingdeletion/'+bidScheduleId)
  }
  deletenullvalue(id): Observable<CreateNewBidSchedule[]>{
    return this.http.delete<CreateNewBidSchedule[]>(this.url+'/bidscheduleidrefnull/'+id)
  }
}
