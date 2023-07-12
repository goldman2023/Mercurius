import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { NewS } from 'src/app/model/newS';
import { SaveGeneratedSchedule } from 'src/app/model/saveGeneratedSchedule';
import { SaveShiftDefintionDataBasedOnScheduleName } from 'src/app/model/saveShiftDefintionDataBasedOnScheduleName';

@Injectable({
  providedIn: 'root'
})
export class GeneratedScheduleService {



  token: any;
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
  newSaveAllShiftLine(allShiftLineData): Observable<SaveGeneratedSchedule>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.post<SaveGeneratedSchedule>(this.url+'/shiftlinepost',allShiftLineData,{headers:header})
    }
  saveAllShiftLine(allShiftLine: any): Observable<SaveGeneratedSchedule[]>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.post<SaveGeneratedSchedule[]>(this.url+'/allshiftline',allShiftLine,{headers:header})
    }

    saveOneShiftLine(shiftLine: any): Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
      let header = new HttpHeaders().set(
        'Authorization', `Bearer ${this.token}`
      );
      return this.http.post<SaveGeneratedSchedule[]>(this.url+'/shiftline ',shiftLine,{headers:header})
      }
    getAllSchedule():Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftline',{headers:header})
    }
    newgetAllSchedule(userId):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftlinebasedonuserid/'+userId,{headers:header})
    }
    newgetAllShiftLinesBasedOnScheduleId(scheduleId):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftlinebasedonshid/'+scheduleId,{headers:header})
    }
    newgetAllShiftLinesBasedOnUserIdAndScheduleName(scheduleName,userId):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftlinebyschedulenameuserid?schedulename='+scheduleName+'&userid='+userId,{headers:header})
    }

    newGetShiftLineBasedOnShiftLineId(shiftlineId):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftlinechildget/'+shiftlineId,{headers:header})
    }


    updateSchedule(id,shiflineData):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.put<SaveGeneratedSchedule[]>(this.url+'/shiftline/'+id,shiflineData,{headers:header})
    }
    newupdateSchedule(id,shiflineData):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.put<SaveGeneratedSchedule[]>(this.url+'/shiftlineput/'+id,shiflineData,{headers:header})
    }
    deleteSchedule(id):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.delete<SaveGeneratedSchedule[]>(this.url+'/shiftline/'+id,{headers:header})
    }
    checkScheduleName(scheduleName):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.post<SaveGeneratedSchedule[]>(this.url+'/shiftlineschedulename',scheduleName,{headers:header})
    }
    newcheckScheduleName(scheduleName,userID):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<SaveGeneratedSchedule[]>(this.url+'/shiftnamecheck?schedulename='+scheduleName+'&userid='+userID,{headers:header})
    }


    deleteScheduleBasedOnName(scheduleName):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.delete<SaveGeneratedSchedule[]>(this.url+'/deletebyschedulename/'+scheduleName,{headers:header})
    }
    newDeleteShiftLineSchedule(scheduleId):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.delete<SaveGeneratedSchedule[]>(this.url+'/shiftlinedelete/'+scheduleId,{headers:header})
    }

    getScheduleNameBasedOnId(id: number): Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
      let header = new HttpHeaders().set(
        'Authorization', `Bearer ${this.token}`
      );
      return this.http.get<SaveGeneratedSchedule[]>(this.url + '/allschedulenamesforuserid/' + id)
    }

    saveShiftDefintionDataBasedOnScheduleName(shiftDefintionData):Observable<SaveShiftDefintionDataBasedOnScheduleName[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
      let header = new HttpHeaders().set(
        'Authorization', `Bearer ${this.token}`
      );
      return this.http.post<SaveShiftDefintionDataBasedOnScheduleName[]>(this.url + '/mergemany' ,shiftDefintionData,{headers:header})
    }
    getSaveShiftDefintionDataBasedOnScheduleName(scheduleName):Observable<SaveShiftDefintionDataBasedOnScheduleName[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
      let header = new HttpHeaders().set(
        'Authorization', `Bearer ${this.token}`
      );
      return this.http.get<SaveShiftDefintionDataBasedOnScheduleName[]>(this.url + '/shiftlinebasedonname/'+scheduleName,{headers:header})
    }
    deleteSaveShiftDefintionDataBasedOnScheduleName(scheduleName):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.delete<SaveGeneratedSchedule[]>(this.url+'/mergedeletebyshname/'+scheduleName,{headers:header})
    }

    newdeleteShiftLine(id):Observable<SaveGeneratedSchedule[]>{
      this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.delete<SaveGeneratedSchedule[]>(this.url+'/shiftlinechilddelete/'+id,{headers:header})
    }


}
