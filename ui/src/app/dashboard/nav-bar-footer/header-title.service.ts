import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {
  public title = new BehaviorSubject('');
  public defaultHeader = new BehaviorSubject(true);
  public defaultTimer = new BehaviorSubject('');
  public defaultEndDate = new BehaviorSubject('');
  public forwardUrl = new BehaviorSubject('URL');
  public goBackUrl = new BehaviorSubject('URL');
  constructor() { }
  setTitle(title) {

    this.title.next(title);
  }
  setForwardUrl(forwardUrl){

    this.forwardUrl.next(forwardUrl)
  }
  setDefaultHeader(dH){
    this.defaultHeader.next(dH)
  }
  checkBiddingTime(time){
    this.defaultTimer.next(time)
  }
  checkBiddingEndDate(date){
    this.defaultEndDate.next(date)
  }
  setBackUrl(goBackUrl){
    this.goBackUrl.next(goBackUrl)
  }
}
