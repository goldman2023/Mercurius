import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssingscheduleService {
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

  getEmployeeListByUserId(userId): Observable<any>{
    return this.http.get<any>(this.url+'/employeelistbasedonmanagerid/'+userId)
  }

  getShiftlinesByUserId(userId): Observable<any>{
    return this.http.get<any>(this.url + '/shiftlinebasedonuserid/'+userId)
  }
  getShiftlinesByUserIdAndStatus(userId,status): Observable<any>{
    return this.http.get<any>(this.url + '/shiftlinebasedonuseridandselectionstatus?uId='+userId +'&status='+status)
  }
// ============ add assign schedule api=========================
  creatBidParamPost(data): Observable<any>{
    return this.http.post<any>(this.url + '/bidparampost',data)
  }

  checkBidScheduleName(name,managerId): Observable<any>{
    return this.http.get<any>(this.url + '/bidschedulenamecheck?bidschedulename=' + name + '&managerid=' + managerId);
  }

  createBiddingPostMore(data): Observable<any>{
    return this.http.post<any>(this.url + '/biddingpostmore',data)
  }
  // ========== end      ====================================
}
