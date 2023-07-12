import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateNewBidSchedule } from 'src/app/model/createNewBidSchedule';

@Injectable({
  providedIn: 'root'
})
export class BidScheduleService {

  private url=location.origin+':2020'
  constructor(private http: HttpClient) {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.url='http://3.13.254.87:2020'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87' || location.hostname=='3.141.13.130' || location.hostname=='dev-webapp.straightlines.io'){
      this.url='http://3.13.254.87:2020'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this.url='http://52.14.8.217:2020'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this.url='http://3.140.109.198:2020'
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
    this.deletenullvalue()
    return this.http.delete<CreateNewBidSchedule[]>(this.url+'/bidparamdelete/'+bidScheduleId)
  }
  deleteAllDataBasedOnBidScheduleId(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    this.deletenullvalue()
    return this.http.delete<CreateNewBidSchedule[]>(this.url+'/biddingdeletion/'+bidScheduleId)
  }
  deletenullvalue(): Observable<[]>{
    return this.http.delete<[]>(this.url+'bidscheduleidrefnull/0 ')
  }
}
