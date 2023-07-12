import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as XLSX from 'xlsx';
import { RequiredWorkforce } from '../model/requiredWorkforce';
import { ScheduleData } from '../model/ScheduleData';
@Injectable({
  providedIn: 'root'
})
export class ScheduleDataService {

  private url: string = "https://localhost:3000/scheduled-shift-lines"



  constructor(private http: HttpClient) { }


postScheduleData(testing):Observable<RequiredWorkforce[]>{
  return this.http.post<RequiredWorkforce[]>(this.url,testing)

   }
    getScheduleData():Observable<ScheduleData[]>{
     return this.http.get<ScheduleData[]>(this.url)

      }

      getScheduleDataById(id: number): Observable<ScheduleData[]>{
        return this.http.get<ScheduleData[]>(this.url + "/" + id)
      }

      updateScheduleData(id:number,scheduleData: any): Observable<ScheduleData[]>{
        return this.http.put<ScheduleData[]>(this.url+'/'+id ,scheduleData)
      }
      delete(id: number){
        return this.http.delete(this.url+'/'+id);

      }

      // exportToExcel(scheduleData: any, arg1: string):Observable<WorkLoad[]>{
      //   return this.http.get<WorkLoad[]>(this.url)
      //   .pipe(catchError(this.errorHandler));
      //    }
      errorHandler(errorHandler: any): import("rxjs").OperatorFunction<ScheduleData[], ScheduleData[]> {
    throw new Error('Method not implemented.');
  };
}
