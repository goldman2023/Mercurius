import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { BidNptlLeaveSetup } from 'src/app/model/bidNptlLeaveSetup';
import { BidPtlLeaveSetup } from 'src/app/model/bidPtlLeaveSetup';
@Injectable({
  providedIn: 'root'
})
export class BidLeaveSetupService {

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
  addNewBidPtlLeave(newBidPTLleave): Observable<BidPtlLeaveSetup[]>{
    return this.http.post<BidPtlLeaveSetup[]>(this.url+'/bidptlleave',newBidPTLleave)
  }
  addNewBidNptlLeave(newBidNPTLleave): Observable<BidNptlLeaveSetup[]>{
    return this.http.post<BidNptlLeaveSetup[]>(this.url+'/bidnptlleave',newBidNPTLleave)
  }
  getAllBidPtlLeave():Observable<BidPtlLeaveSetup[]>{
    return this.http.get<BidPtlLeaveSetup[]>(this.url+'/bitptlleaveget')
  }
  getAllBidNptlLeave():Observable<BidNptlLeaveSetup[]>{
    return this.http.get<BidNptlLeaveSetup[]>(this.url+'/bitnptlleaveget')
  }
  getAllBidPtlLeaveBasedOnBSName(bidScheduleName):Observable<BidPtlLeaveSetup[]>{
    return this.http.get<BidPtlLeaveSetup[]>(this.url+'/bidptlleavebasedonschedulename/'+bidScheduleName)
  }
  getAllBidNptlLeaveBasedOnBSName(bidScheduleName):Observable<BidNptlLeaveSetup[]>{
    return this.http.get<BidNptlLeaveSetup[]>(this.url+'/bidnptlleavebasedonschedulename/'+bidScheduleName)
  }
  deleteBidLeave(bidScheduleName){
    return this.http.delete(this.url+'/bidleavedeletebyshname/'+bidScheduleName);

  }
  deleteBidLeaveBasedOnId(id){
    return this.http.delete(this.url+'/bidleavedeletebyleaveid/'+id);

  }
}
