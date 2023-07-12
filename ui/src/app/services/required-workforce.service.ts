import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequiredWorkforce } from '../model/requiredWorkforce';
import { ScheduleData } from '../model/ScheduleData';
import straightlines_io_python_apis from 'src/app/json/apis.json';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RequiredWorkforceService {
  test:any []=[]
  test1:any []=[]


  private _url=straightlines_io_python_apis.python_apis.url
  private url=location.origin+':5000'
  constructor(private router:Router,private http: HttpClient) {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.url='http://3.13.254.87:5000'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
      this.url='https://dev.straightlines.io/python'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this.url='https://test.straightlines.io/python'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this.url='https://staging.straightlines.io/python'
    }else{
      this.url='http://18.119.62.157:5000'
    }
  }
  postRequiredWorkforceData(row: number,requiredWorkforceData: any): Observable<RequiredWorkforce[]>{

    return this.http.post<RequiredWorkforce[]>(this.url+'/schedule/'+row,requiredWorkforceData)

  }
  checkShiftlineName(shiftlineData: any): Observable<RequiredWorkforce[]>{
     return this.http.post<RequiredWorkforce[]>(this.url+'/get_shift_line_name',shiftlineData)
  }
  importExcelSheet(file){
      return this.http.post(this._url+'/parse_user_schedule',file, {
      })}
  errorHandler(errorHandler: any): import("rxjs").OperatorFunction<RequiredWorkforce[], RequiredWorkforce[]> {
    throw new Error('Method not implemented.');
  }

      // getRequiredWorkforceDataById(row: number,requiredWorkforceData: any): Observable<RequiredWorkforce[]>{
      //   return this.http.post<RequiredWorkforce[]>(this._url+'/'+row,requiredWorkforceData)
      // }
      // addRequiredWorkforceData(requiredWorkforceData: any): Observable<RequiredWorkforce[]>{
      //   const body=JSON.stringify(requiredWorkforceData);

      //   return this.http.post<RequiredWorkforce[]>(this.url ,requiredWorkforceData)
      // }
      // updateRequiredWorkforceData(requiredWorkforceData: any): Observable<RequiredWorkforce[]>{
      //   return this.http.put<RequiredWorkforce[]>(this.url+'/',requiredWorkforceData)
      // }

  //     requiredWorkforceData(requiredWorkforceData: any): Observable<RequiredWorkforce[]>{
  //   return this.http.post<RequiredWorkforce[]>(this.url ,requiredWorkforceData)
  // }

}
