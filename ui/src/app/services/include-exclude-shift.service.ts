import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftDefinition } from '../model/shiftDefinition';
import straightlines_io_java_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class IncludeExcludeShiftService {
token
private _url:string=straightlines_io_java_apis.java_apis.url
private url=location.origin+':2020'
constructor(private http: HttpClient) {
  if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.url='https://dev.straightlines.io/java'
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

  includeExcludeService(shift_id: any,shift_data:any): Observable<ShiftDefinition[]>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.put<ShiftDefinition[]>(this.url+'/shiftdefinition/'+shift_id,shift_data,{headers:header})
  }
}
