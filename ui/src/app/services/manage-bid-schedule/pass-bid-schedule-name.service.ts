import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PassBidScheduleNameService {
  private bidScheduleName = new BehaviorSubject<string>('service');
  currentBidScheduleName = this.bidScheduleName.asObservable();
  constructor() { }
  changeBidScheduleName(bidScheduleName: string) {
    this.bidScheduleName.next(bidScheduleName)
  }
}
