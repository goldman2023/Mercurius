import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleForModalPageService {

  public title = new BehaviorSubject('Title');
  public forwardUrl = new BehaviorSubject('URL');
  public goBackUrl = new BehaviorSubject('URL');
  constructor() { }
  setTitle(title) {

    this.title.next(title);
  }

}
