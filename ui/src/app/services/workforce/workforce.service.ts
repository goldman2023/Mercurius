import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/app/dashboard/admin/shared-data.service';
import { ShiftLineWorkforce } from 'src/app/model/workForce';
@Injectable({
  providedIn: 'root'
})
export class WorkforceService {
    private baseURL: string;
    constructor(private sharedService: SharedDataService,
        private http: HttpClient)
    {
        this.baseURL = this.sharedService.baseUrl();
    }

    saveWorkforceDetails(workforceDetails: any): Observable<ShiftLineWorkforce[]>{
        return this.http.post<ShiftLineWorkforce[]>(this.baseURL+'/saveworkforcedetails', workforceDetails)
    }
}
