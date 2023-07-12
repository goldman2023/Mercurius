import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyBiddingService {

  public title = new BehaviorSubject('');
  public defaultHeader = new BehaviorSubject(true);
  public forwardUrl = new BehaviorSubject('URL');
  public goBackUrl = new BehaviorSubject('URL');
  constructor() { }
  setTitle(title) {

    this.title.next(title);
  }
}
