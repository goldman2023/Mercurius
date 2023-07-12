import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { emailVerify } from '../model/emailVerify';
import straightlines_io_java_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
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

  emailVerify(email: any): Observable<emailVerify[]>{
    return this.http.post<emailVerify[]>(this.url+'/forgot-password/'+email,'')
  }
  updatePass(token : any,pass): Observable<emailVerify[]>{
    return this.http.put<emailVerify[]>(this.url+'/resetpassword?token='+token+'&password='+pass,{})
  }
  emailVerificationForForgotPassword(email): Observable<emailVerify[]>{
    return this.http.post<emailVerify[]>(this.url+'/forgotpasswordemailverify/'+email,'')

  }
  verifyEmailForFP(f_token): Observable<emailVerify[]>{
    return this.http.post<emailVerify[]>(this.url+'/verifydone/'+f_token,'')

  }
}
