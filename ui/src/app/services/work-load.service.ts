import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkLoad } from '../WorkLoad';
import { ShiftDefinition } from '../model/shiftDefinition';
import { Time } from '@angular/common';
import straightlines_io_java_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class WorkLoadService {
  token

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

  addNewShiftDefinition(data: string): Observable<ShiftDefinition[]>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.post<ShiftDefinition[]>(this.url+'/shiftdefinition/',data,{headers:header})
  }

  getShiftDefBasedOnDuration(duration: number): Observable<ShiftDefinition[]>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );
    return this.http.get<ShiftDefinition[]>(this.url+'/getshiftdefbasedonduration/'+duration,{headers:header})
  }

  getAllSystemDefinedShiftDefinition(shiftDuration):Observable<any>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );

     return this.http.get(this.url+'/getshiftdefbasedonduration/'+shiftDuration,{headers:header})

      }
  getAllShiftDefinition(user_id):Observable<any>{
    this.token=JSON.parse(sessionStorage.getItem('token'))
    let header = new HttpHeaders().set(
      'Authorization', `Bearer ${this.token}`
    );

     return this.http.get(this.url+'/shiftdefbyuseridandstatus/'+user_id + '/Active',{headers:header})

      }
      deleteShiftDefinition(id: number){
        this.token=JSON.parse(sessionStorage.getItem('token'))
        let header = new HttpHeaders().set(
          'Authorization', `Bearer ${this.token}`
        );
        return this.http.delete(this.url+'/shiftdefinition/'+id,{headers:header});

      }
      errorHandler(_errorHandler: any): import("rxjs").OperatorFunction<WorkLoad[], WorkLoad[]> {

    throw new Error('Method not implemented.');
  }
;
}
