import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import straightlines_io_python_apis from 'src/app/json/apis.json';
import { ScheduleLeaveSummary } from 'src/app/model/scheduleLeaveSummary';
@Injectable({
  providedIn: 'root'
})
export class ScheduleLeaveSummaryService {
  private url=straightlines_io_python_apis.python_apis.url
  private _url=location.origin+':5000'
  constructor(private http: HttpClient) {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this._url='http://3.13.254.87:5000'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
      this._url='https://dev.straightlines.io/python'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this._url='https://test.straightlines.io/python'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this._url='https://staging.straightlines.io/python'
    }else{
      this._url='http://18.119.62.157:5000'
    }
  }
  generateScheduleLeaveSummary(data): Observable<any>{
    const httpOptions : Object = {
      responseType: 'blob'
    };
    return this.http.post<any>(this._url+'/generate_schedule_leave_summary',data,httpOptions)
  }
}
