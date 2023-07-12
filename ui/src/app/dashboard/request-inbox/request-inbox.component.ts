import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertController, ModalController } from '@ionic/angular';
import { UserShftServicesService } from 'src/app/services/user-shift-service/user-shft-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ViewSubmitRequestComponent } from 'src/app/shared/component/view-submit-request/view-submit-request.component';

@Component({
  selector: 'app-request-inbox',
  templateUrl: './request-inbox.component.html',
  styleUrls: ['./request-inbox.component.scss']
})
export class RequestInboxComponent implements OnInit {
  data: any;
  action: any;
  
  constructor(
    private headerTitleService: HeaderTitleService,
    public dialog: MatDialog,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public employeeService: EmployeeService,) { }



  ngOnInit(): void {
    this.headerTitleService.setTitle('');
    this.headerTitleService.setBackUrl('sTlines-dashboard');
    this.headerTitleService.setForwardUrl('');
    this.headerTitleService.setDefaultHeader(true);

  }

}
