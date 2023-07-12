import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckUserDetails } from '../model/checkUserDetails';
import { Login } from '../model/login';
import straightlines_io_java_apis from 'src/app/json/apis.json';
import { Router } from '@angular/router';
import { ConfigService } from './config/config.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private _url=straightlines_io_java_apis.java_apis.url
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

  authenticate(user_data: any): Observable<Login[]>{
      return this.http.post<Login[]>(this.url+'/authenticate',user_data)
    }
    checkUserRoleBidManager(user_name): Observable<Login[]>{
      return this.http.get<Login[]>(this.url+'/bidmanagergetbyemail/'+user_name)
    }
    checkUserRoleEmployee(user_name): Observable<Login[]>{
      return this.http.get<Login[]>(this.url+'/employee/'+user_name)
    }
    getUserDetails(userID,roleID): Observable<any>{
      return this.http.get<any>(this.url+'/getuserdetails?userId='+userID+'&roleId='+roleID)
    }
    loginValidation(){
      return !!sessionStorage.getItem('token')
    }
    loginValidationForEmployee() {
      return !!sessionStorage.getItem('_token')
    }
    loginValidationForGuest() {
      return !!sessionStorage.getItem('token')
    }
    getUserAllDetails(check_user_data): Observable<CheckUserDetails[]>{

      return this.http.post<CheckUserDetails[]>(this.url+'/checkuserinfo',check_user_data)
    }
}
