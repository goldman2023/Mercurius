import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessRulesValidation } from '../model/businessRulesValidation';
import straightlines_io_python_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class BusinessRulesValidationService {


  private _url=straightlines_io_python_apis.java_apis.url
  private url=location.origin+':5000'
  constructor(private http: HttpClient) {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.url='https://dev.straightlines.io/python'
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
  businessRulesCheck(shift_line: any): Observable<BusinessRulesValidation[]>{
    return this.http.post<BusinessRulesValidation[]>(this.url+'/check_shift_line',shift_line)

  }
  businessRulesCheckForArray(shift_line: any): Observable<BusinessRulesValidation[]>{
    return this.http.post<BusinessRulesValidation[]>(this.url+'/check_shift_line_array',shift_line)

  }
  businessRulesCheckForHybridShiftLines(shift_line: any): Observable<BusinessRulesValidation[]>{
    return this.http.post<BusinessRulesValidation[]>(this.url+'/check_hybrid_shift_line',shift_line)

  }
}
