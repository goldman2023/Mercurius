import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventServiceService {

  constructor() { }
  private eventSubject = new Subject<any>();

  emitEvent(data: any) {
    this.eventSubject.next(data);
  }

  getEvent(): Observable<any> {
    return this.eventSubject.asObservable();
  }
}
