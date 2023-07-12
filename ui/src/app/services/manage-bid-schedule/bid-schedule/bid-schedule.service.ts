import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { BidSchedule } from 'src/app/model/bidSchedule';
@Injectable({
  providedIn: 'root'
})
export class BidScheduleService {

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
  checkBidScheduleName(bidScheduleName): Observable<BidSchedule[]>{
    return this.http.get<BidSchedule[]>(this.url+'/bidparamschedulenameexist/'+bidScheduleName)
  }

  addNewBidSchedule(bidScheduleName): Observable<BidSchedule[]>{
    return this.http.post<BidSchedule[]>(this.url+'/bidparamssave',bidScheduleName)
  }

  getAllBidSchedule(userId):Observable<BidSchedule[]>{
    return this.http.get<BidSchedule[]>(this.url+'/bidparambasedonloggeduserid/'+userId)
  }
  getScheduleNameBasedOnBidScheduleName(bidScheduleName): Observable<BidSchedule[]>{
    return this.http.get<BidSchedule[]>(this.url+'/bidparamschedulenamelist/'+bidScheduleName)
  }
  get(bidScheduleName): Observable<BidSchedule[]>{
    return this.http.get<BidSchedule[]>(this.url+'/mergegetbyshname/'+bidScheduleName)
  }




  deleteBidSchedule(bidScheduleName){
    return this.http.delete(this.url+'/bidparamdeletebybidschedulename/'+bidScheduleName);

  }
  updateBidSchedule(bidScheduleName,bidScheduleData): Observable<BidSchedule[]>{
    return this.http.put<BidSchedule[]>(this.url+'/bidparamupdateone/'+bidScheduleName,bidScheduleData)
  }
  updateBidScheduleBasedOnShiftLineAndBidScheduleName(shiftLineScheduleName,bidScheduleName,data): Observable<BidSchedule[]>{
    return this.http.put<BidSchedule[]>(this.url+'/bidparamupdatebyschedulename/'+shiftLineScheduleName+'/'+bidScheduleName,data)
  }
  updateBidScheduleBasedOnId(id,data): Observable<BidSchedule[]>{
    return this.http.put<BidSchedule[]>(this.url+'/bidparamupdatbybidid/'+id,data)
  }

  deleteShiftLineScheduleInBidScheduleBasedOnId(id){
    return this.http.delete(this.url+'/bidparamupdatbybidid/'+id);
  }

  deleteShiftLineScheduleInBidSchedule(shiftlineScheduleName){
    return this.http.delete(this.url+'/bidparamdeletebyschedulename/'+shiftlineScheduleName);
  }
  deleteShiftLineScheduleInBidScheduleBasedOnShcedulenameNameAndBidScheduleName(shiftlineScheduleName,BidScheduleName){
    return this.http.delete(this.url+'/bidparamdeletebyschedulename?shedname='+shiftlineScheduleName+'&bidshname='+BidScheduleName );
  }
}
