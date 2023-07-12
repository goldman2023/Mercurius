import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { BidShiftlines } from 'src/app/model/bid-round/bidShiftLines';
import { CreateNewBidSchedule } from 'src/app/model/createNewBidSchedule';
@Injectable({
  providedIn: 'root'
})
export class EmailNotificationsService {

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
  whenNewEmployeesAreAddedByTheBidManager(bidManagerId): Observable<BidShiftlines[]>{
    return this.http.post<BidShiftlines[]>(this.url+'/notificationfornewuser/'+bidManagerId,[])
  }
  whenBidManagerCreateTheNewBidSchedule(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidwindowalloctaion/'+bidScheduleId)
  }
  whenBidManagerUpdateTheNewBidSchedule(bidScheduleId): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidschedulechanged/'+bidScheduleId)
  }
  whenBidWindowDurationHasIncreased(bidScheduleId,empid,roundid): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidscheduleincreased?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+roundid)
  }
  WhenEmployeeFinishesBiddingForAnyRound(bidScheduleId,empid,roundid,vactionExhausted): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidschedulecomplete?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+roundid+'&vacationcount=0&vaactionexhausted='+vactionExhausted)
  }
  WhenEmployeeFinishesBiddingForAnyRoundWithSkippedVacation(bidScheduleId,empid,roundid,vacationcount): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidschedulecomplete?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+roundid+'&vacationcount='+vacationcount+'&vaactionexhausted=0' )
  }
  skipVacationBidding(bidScheduleId,empid,roundid,vacationcount): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforskipvacation?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+roundid+'&Vacationcount='+vacationcount )
  }
  emailNotificationForSystemAssignShiftLines(bidScheduleId,empid): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforsystemcomplete?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+1)
  }
  whenEmployeeFinishesBiddingForAnyRound(bidScheduleId,empid,roundid,vactionExhausted): Observable<CreateNewBidSchedule[]>{
    return this.http.get<CreateNewBidSchedule[]>(this.url+'/notificationforbidschedulecomplete?BidscheduleId='+bidScheduleId+'&Empid='+empid+'&Roundid='+roundid+'&vacationcount=0&vaactionexhausted='+vactionExhausted)
  }
}
