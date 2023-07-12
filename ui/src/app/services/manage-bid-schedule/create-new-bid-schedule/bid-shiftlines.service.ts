import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { BidShiftlines } from 'src/app/model/bid-round/bidShiftLines';
@Injectable({
  providedIn: 'root'
})
export class BidShiftlinesService {
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
  saveBidShiftlinesData(bidShiftlinesData): Observable<BidShiftlines[]>{
      return this.http.post<BidShiftlines[]>(this.url+'/biddingpostmore',bidShiftlinesData)
  }
  getBidShiftlinesData(bidScheduleName): Observable<BidShiftlines[]>{
    return this.http.get<BidShiftlines[]>(this.url+'/biddingbasedonschname/'+bidScheduleName)
  }
  getBidShiftlinesDataBasedOnBidScheduleid(id): Observable<BidShiftlines[]>{
    return this.http.get<BidShiftlines[]>(this.url+'/biddingbasedonbidscheduleidref/'+id)
  }
  getBidShiftlinesDataBasedOnEmpid(id): Observable<BidShiftlines[]>{
    return this.http.get<BidShiftlines[]>(this.url+'/biddingbasedonempid/'+id)
  }
  getBidShiftlinesDataBasedOnBidScheduleId(bidId): Observable<BidShiftlines[]>{
    return this.http.get<BidShiftlines[]>(this.url+'/shiftlinechildgetbybidschid/'+bidId)
  }
  updateBidShiftlineData(bidShiftlineId,bidShiftlineData): Observable<BidShiftlines[]>{
    return this.http.put<BidShiftlines[]>(this.url+'/biddingupdatebybidid/'+bidShiftlineId,bidShiftlineData)
  }
  updateBidShiftlineDataArray(bidShiftlineData): Observable<BidShiftlines[]>{
    return this.http.put<BidShiftlines[]>(this.url+'/biddingputmore',bidShiftlineData)
  }
  deleteBidShiftlineData(id): Observable<BidShiftlines[]>{
    return this.http.delete<BidShiftlines[]>(this.url+'/deletebasedonbidingid/'+id)
  }
}
