import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

@Component({
  selector: 'app-view-selected-employee-summary',
  templateUrl: './view-selected-employee-summary.component.html',
  styleUrls: ['./view-selected-employee-summary.component.scss']
})
export class ViewSelectedEmployeeSummaryComponent implements OnInit {

  user_data: any;
  allEmployee=[]
  view_bid_schedule_id: any;
  viewBidSchedule
  editBidSchedule=true
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private getAllEmp:AddNewEmployeeService,
    public alertController:AlertController,
    private scheduleService:GeneratedScheduleService,
    private setUPbidRoundSer:SetupBidRoundService,
    private bidScheduleSer:CreateNewBidScheduleService
    ) {
    this.view_bid_schedule_id=navParams.get('view_bid_schedule_id')

  }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
          this.viewBidScheduleData()

  }
  viewBidScheduleData(){
    this.bidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.view_bid_schedule_id).subscribe((res)=>{
      this.viewBidSchedule=res
      var temp
      for(var i=0;i<this.viewBidSchedule.employeemap.length;i++){
        this.getAllEmployeeList(this.viewBidSchedule.employeemap[i].empidref)
      }
    },(err)=>{},()=>{})
  }
  getAllEmployeeList(empId){
    this.getAllEmp.getEmpDataBasedOnEmpId(empId).subscribe(
      (res)=>{
        this.allEmployee.push(res)
        this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)

    },
      (err)=>{console.log(err)},()=>{})
  }
  close(){
    this.modalCtrl.dismiss()
  }
  cssForTotalEmployee(totalSelectdEmployees){
    if(totalSelectdEmployees<10){
      return 'round-button-single-digit data'
    }else if(totalSelectdEmployees>9 && totalSelectdEmployees<100){
      return 'round-button-double-digit data'
    }else{
      return 'round-button-three-digit data'
    }

  }
}
