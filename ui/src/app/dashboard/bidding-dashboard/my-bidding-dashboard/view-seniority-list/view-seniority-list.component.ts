import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { IonToggle, NavController } from '@ionic/angular';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { environment } from 'src/environments/environment';
import { MyBiddingService } from '../my-bidding.service';

@Component({
  selector: 'app-view-seniority-list',
  templateUrl: './view-seniority-list.component.html',
  styleUrls: ['./view-seniority-list.component.scss'],
})
export class ViewSeniorityListComponent implements OnInit {
  user_data: any;
  @ViewChild('mytoggle', {static: true}) mytoggle: IonToggle;
  allEmployee=[]
  editlist=true
  changeToggleValue
  round_id
  rowCount = 0;
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  bid_schedule_name="none"
  constructor(private route: ActivatedRoute,public navCtrl: NavController,
    private myBiddingSer:MyBiddingService,
    private cdref: ChangeDetectorRef,
    public formBuilder: FormBuilder,
    private getAllEmp:AddNewEmployeeService,
    private headerTitleService: HeaderTitleService,
    private http: HttpClient) {
    this.route.params.subscribe(params => {
      this.bid_schedule_name = params['_bidScheduleName'];
        this.round_id = params['_rid'];
        this.passBidScheduleName.emit(this.bid_schedule_name)
        this.passroundId.emit(this.round_id)
  });
    }
  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.headerTitleService.setTitle('My Bidding');
    this.headerTitleService.setDefaultHeader(true)
    this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? straightlines_io_apis.apis.employee_home : straightlines_io_apis.apis.my_bidding);
      this.headerTitleService.setForwardUrl(null);this.headerTitleService.checkBiddingTime('biddingheader')
      this.myBiddingSer.setTitle('seniorityList')
      this.passBidScheduleName.emit(this.bid_schedule_name)
      this.passroundId.emit(this.round_id )
      this.allEmp()
      this.editlist=true



  }
  toggleCss(){
    if(/webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
      return 'iPhone'
    }else{
      return 'android'
    }
  }


  changeToggle(e){
    this.editlist=!this.changeToggleValue
  }
   allEmp(){
    this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res)=>{this.allEmployee=res
        this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)

    },
      (err)=>{console.log(err)},()=>{})
}
drop(event: CdkDragDrop<string[]>) {

  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }

  var oldIndex,newIndex
  oldIndex=event.previousIndex
  newIndex=event.currentIndex
      var temp=[],tempArr=[],tempRankOne,tempRank
      temp=event.container.data
      for(var i=0;i<temp.length;i++){

        var tempObj={"email": temp[i].email,
        "fname": temp[i].fname,
        "empid": temp[i].empid,
        "initials": temp[i].initials,
        "lname": temp[i].lname,
        "phone": temp[i].phone,
        "qualification": temp[i].qualification,
        "rank": i+1,
        "role": temp[i].role,
        "managerid":temp[i].managerid,
        "vacation": temp[i].vacation
      }
        tempArr.push(tempObj)
      }
      this.allEmployee=tempArr

      this.getAllEmp.updateAllEmp(this.allEmployee).subscribe((res)=>{

      },
      (err)=>{console.log(err)},()=>{})
  }

loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
generateDocument() {
  this.allEmp();
  const data = { "items": this.allEmployee.map(({ rank, fname, lname }) => ({ rank, name: `${fname.charAt(0).toUpperCase()}${fname.slice(1)} ${lname.charAt(0).toUpperCase()}${lname.slice(1)}`}))};
  const expressionParser = require("docxtemplater/expressions.js");
  this.loadFile(
    environment.SENIORITY_LIST_TEMPLATE,
    async function (error, content) {
        if (error) throw error;
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            parser: expressionParser
        });
        doc.render(data);

        var blob = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",
        });
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        const filename = `Seniority List ${formattedDateTime}`;
        saveAs(blob, filename);
      }
    );
  }
}
