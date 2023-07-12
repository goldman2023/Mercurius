import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import straightlines_io_java_apis from 'src/app/json/apis.json';
@Injectable({
  providedIn: 'root'
})
export class TrialPeriodService {
  public trialperiod = new BehaviorSubject(3);
  private url=straightlines_io_java_apis.java_apis.url

  constructor(private http: HttpClient) { }
  trialPeriod(trialperiod){
    this.trialperiod.next(trialperiod)
  }
}
