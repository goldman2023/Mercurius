import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Registration } from '../model/registration';
import straightlines_io_java_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {
  private _url:string=straightlines_io_java_apis.java_apis.url
  private url=location.origin+':2020'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

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
  emailValidator(email: any): Observable<Registration[]>{
      return this.http.post<Registration[]>(this.url+'/emailexist',email, this.httpOptions)

    }
    emailVerification(email): Observable<Registration[]>{

        return this.http.post<Registration[]>(this.url+'/letsverifybyusername/'+email,'')

      }

      verifiedEmail(code): Observable<Registration[]>{

        return this.http.post<Registration[]>(this.url+'/verifydoneforregister/'+code,'')


      }
}
