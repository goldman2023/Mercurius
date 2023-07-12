import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { isEqual } from 'lodash';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';

import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import Swal from 'sweetalert2';
import { IncorrectShiftlineScheduleMessageComponent } from '../create-new-bid-schedule/incorrect-shiftline-schedule-message/incorrect-shiftline-schedule-message.component';
import { BidRoundSummaryComponent } from '../create-new-bid-schedule/select-bid-rounds/bid-round-summary/bid-round-summary.component';
import { SelectBidRoundsComponent } from '../create-new-bid-schedule/select-bid-rounds/select-bid-rounds.component';
import { SelectEmployeeComponent } from '../create-new-bid-schedule/select-employee/select-employee.component';
import { SelectedEmployeeSummaryComponent } from '../create-new-bid-schedule/select-employee/selected-employee-summary/selected-employee-summary.component';
import { SelectShiftlineScheduleSummaryComponent } from '../create-new-bid-schedule/select-shiftline/select-shiftline-schedule-summary/select-shiftline-schedule-summary.component';
import { SelectShiftlineComponent } from '../create-new-bid-schedule/select-shiftline/select-shiftline.component';
import { SelectVacationSlotSummaryComponent } from '../create-new-bid-schedule/select-vacation-slots/select-vacation-slot-summary/select-vacation-slot-summary.component';
import { SelectVacationSlotsComponent } from '../create-new-bid-schedule/select-vacation-slots/select-vacation-slots.component';

@Component({
  selector: 'app-edit-bid-schedule',
  templateUrl: './edit-bid-schedule.component.html',
  styleUrls: ['./edit-bid-schedule.component.scss'],
})
export class EditBidScheduleComponent implements OnInit {
  @ViewChild('bidRoundPanel') bidRoundPanel: MatExpansionPanel;
  @ViewChild('vacationSlotsPanel') vacationSlotsPanel: MatExpansionPanel;
  @ViewChild('employeePanel') employeePanel: MatExpansionPanel;
  @ViewChild('shiflinePanel') shiflinePanel: MatExpansionPanel;
  @ViewChild('bidRoundPanel', { read: ElementRef }) bidRoundPanelElement: ElementRef;
  @ViewChild('vacationSlotsPanel', { read: ElementRef }) vacationSlotsPanelElement: ElementRef;
  checkValuechanged: boolean = false
  employeesLoaded: boolean = false
  slotsValid : boolean = true;
  view_bid_schedule_id
  setUpBidParametersForm: FormGroup;
  select_shiftline_schedule
bidScheduleData={"bid_schedule_name":'',
"bid_schedule_start_date":'',
"select_qualification":'',
"select_shiftline_schedule_name":'',
"select_employess":''}
  message:string= 'secondChild';
  checkShiftLineSchedule=false
  checkShiftLineQualification=false
  checkShiftLineBidSchedule=false
  checkShiftLineStartDate=false
  all_slots=[{"id":1, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3},{"id":2, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3},
  {"id":3, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3},{"id":4, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3},
  {"id":5, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3},{"id":6, "start_date":"03/27/2021","end_date":"04/24/2021","PTL_slots":3}]
  getAllScheduleName: any[];
  schedulename=''
  user_data: any;
  all_final_data: any;
  all_qualification=[]
  checkBidSchedule_Name=false;
  allEmployee=[]
  setUpBidScheduleOne
  disableSelectEmpOtion=true
  maxDate
  minDate
  all_Bid_schedule_list
  check_bidScheduleName=false
  checkShiftLineScheduleForEdit=false
  allScheduleData: any[];
  checkForEditSchedule=false
  allBidScheduleNumbers=1;
  disableSelectEmpOption=false
  newBidSchedule
  empHide=false
  checkClickForPopup=false;
  currentPopupId: any;
  popUpId: any;
  oldPopUpId: any;
  checkBidScheduleData=false
  checkForViewBidSchedule
  scheduleNameForm: FormGroup;
  saveSchedule=[];
  all_Schedule: any;
  updateScheduleId: any;
  schedule__name: any;
  allShiftData=[]
  scheduleNameUnique=true;
  saveDuplicateSchedule=[];
  all_bid_WindoRound_data=[]
  bid_schedule_name
  popUpEmpId
  all_SBP_rounds=[]
  currentSelectedRound
  roundDuration
  checkData=true
  currentactiveRoundNumber=0
  roundStartTime: any;
  roundStartDate: Date;
  currentBidRoundData: any[];
  allEmpForBidding: any[];
  roundEndTime: any;
  finalViewBidWindowData: any[];
  interval: any;
  distance: any;
  seconds: any;
  minutes: any;
  timePopUpId: any;
  oldTimePopUpId: any;
  isDesktop: boolean = false;
  currentBidScheduleData
  defaultMAxLeave: number;
  maxLeave: number;
  totalBidRounds: number;
  allRoundInfo: any[];
  totalEmp=0;
  totalDefaultEmp: any;
  all_bid_round_data: any[];
  all_window_data=[]
  shiftLinesSchedule: any[];
  all_final_data_for_total_emp: any[];
  bidSchedule: any;
  shiftlineScheduleData: any;
  all_Employee=[]
  newBidScheduleId=0
  list_all_emp_for_bid=[]
  bid__ScheduleName: any;
  all_bid_windows_id=[]
  bid_shiftline=[]
  totalCreatedVacationHours: any;
  totalRequiredVacationHours: any;
  prevState: any;
  isUpdated: boolean = false;
  totalAccumulatedLeaves: any;
  totalRequiredHours
  totalHours
  totalEmpSelected=0
  check_correct_shitline_schedule=false
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public platform: Platform,
    private headerTitleService: HeaderTitleService,
    public actionSheetController: ActionSheetController,
    private bidWindowSer:BidWindowService,
    private getAllEmp:AddNewEmployeeService,
    private emailNotify:EmailNotificationsService,
    public alertController: AlertController,
    private bidShiftLineSer:BidShiftlinesService,
    private scheduleService:GeneratedScheduleService,
    private bidScheduleSer:CreateNewBidScheduleService,
    public alertCtrl: AlertController,
    private activaRouter: ActivatedRoute,
    private localData: LocalDataService
  ) {
    this.activaRouter.params.subscribe(params => {
      this.view_bid_schedule_id=params['_id']
    });

  }

  ngOnInit() {
    this.checkIsDesktop()
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.all_bid_windows_id=[]
    this.totalRequiredVacationHours=JSON.parse(this.localData.getItem('edittotalRequiredVacationHours'))
    if(this.totalRequiredVacationHours==undefined){
      this.totalRequiredVacationHours=0
    }
    this.totalRequiredHours=this.totalRequiredVacationHours
    this.totalCreatedVacationHours=JSON.parse(this.localData.getItem('edittotalCreatedVacationHours'))
    if(this.totalCreatedVacationHours==undefined){
      this.totalCreatedVacationHours=0
    }
    this.totalHours=this.totalCreatedVacationHours
    this.bidWindowSer.getBidWindowData(this.view_bid_schedule_id).subscribe((res)=>{

      var temp=res
      for(var i=0;i<temp.length;i++){
        this.all_bid_windows_id.push(temp[i].duid)
      }

    },(err)=>{console.log(err)},()=>{})

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.minDate = String( yyyy + '-' +mm + '-' + dd );
    this.maxDate=String((yyyy+ + +3+ '-' +mm + '-' + dd ))


    this.all_final_data=[]

          this.headerTitleService.setTitle('Edit Bid Schedule');
          this.headerTitleService.setDefaultHeader(false)
          this.headerTitleService.setBackUrl(straightlines_io_apis.apis.manage_bid_schedule);
          this.headerTitleService.setForwardUrl(null);this.headerTitleService.checkBiddingTime('');this.headerTitleService.checkBiddingEndDate('');



      this.checkForViewBidSchedule='edit'
      this.prevState = JSON.parse(this.localData.getItem('editBidSchedule'))
      this.loadData();
  }
  loadData(){
    var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))
    if(tempObj==null){
      this.checkBidScheduleData=false
    }else{
      this.bid_schedule_name=tempObj.bidschename
      if(tempObj.shiftdefmap.length>0 || tempObj.employeemap.length>0 || tempObj.leavemap.length>0 || tempObj.roundmap.length>0){
        this.checkBidScheduleData=true
      }else{
        this.checkBidScheduleData=false
      }
      this.allShiftlinesData()
    }
      this.getAllEmployeeList()

      if(tempObj==null){
        this.newBidSchedule=null
      }else{
        this.newBidSchedule=tempObj
        this.totalEmpSelected=this.newBidSchedule.employeemap.length
        this.getAllShiftLineschedule()

      }
      if(this.newBidSchedule!=undefined){
        if(this.newBidSchedule.roundmap!=undefined){
          if(this.newBidSchedule.roundmap.length>0){
            var  rmap=this.newBidSchedule.roundmap
            rmap=rmap.sort((a,b)=>{return Number(a.roundseq_id) -Number(b.roundseq_id)})
            var startDate=rmap[0].roundstartdate.split('T')[0]
            var startTimme=rmap[0].roundstarttime

            if(this.bidShculeTimeZone==undefined || this.bidShculeTimeZone==null || this.bidShculeTimeZone==''){
              this.bidShculeTimeZone='US/Eastern'
            }else{
              this.bidShculeTimeZone=this.newBidSchedule.timezone
            }
                var todayCheck,date,invdate,diff
                date = new Date();
                invdate = new Date(date.toLocaleString('en-US', {
                  timeZone: this.bidShculeTimeZone
                }));
                diff = date.getTime() - invdate.getTime();
                todayCheck=new Date(date.getTime() - diff)

            if(new Date(Number(startDate.split('-')[0]),Number(startDate.split('-')[1])+ - +1,Number(startDate.split('-')[2]),Number(startTimme.split(':')[0]),Number(startTimme.split(':')[1]),0).getTime()<todayCheck.getTime()){
              if(new Date(Number(startDate.split('-')[0]),Number(startDate.split('-')[1])+ - +1,Number(startDate.split('-')[2]),0,0,0).getTime()<new Date(todayCheck.getFullYear(),todayCheck.getMonth(),todayCheck.getDate(),0,0,0).getTime()){
                this.checkPastTimeOrDateOne='date'
                this.checkPastTimeOrDateTwo='date'
              }else{
              this.checkPastTimeOrDateOne='start time'
                this.checkPastTimeOrDateTwo='time'
              }
            this.checkPastTimeAndDate=true
            }else{
              this.checkPastTimeAndDate=false
            }
          }
        }
      }
      this.bidShiftLineSer.getBidShiftlinesDataBasedOnBidScheduleid(this.view_bid_schedule_id).subscribe((res)=>{

        var temp
        temp=res
        this.bid_shiftline=[]
        for(var i=0;i<temp.length;i++){
            this.bid_shiftline.push(temp[i].bidid)
        }

      },(err)=>{console.log(err)},()=>{})
  }
  checkIsDesktop(){
    this.isDesktop = this.platform.width() > 992;
  }
  checkPastTimeOrDateOne='date or start time'
  checkPastTimeOrDateTwo='date or time'
  bidShculeTimeZone='US/Eastern'
  checkPastTimeAndDate=false
  shiftLinesScheduleSelected=[]
  shiftLinesScheduleselected
  getAllShiftLineschedule(){
    this.shiftLinesScheduleSelected=new Array()
    for(var i=0;i<this.newBidSchedule.shiftdefmap.length;i++){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.newBidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
      this.shiftLinesScheduleselected=res[0]

      this.shiftLinesScheduleSelected.push(this.shiftLinesScheduleselected)
      this.convertArraydata()
    },(err)=>{console.log(err)},()=>{})
  }

  this.convertArraydata()
  }
  all_final_data_shiftline_length=[]
  convertArraydata(){
    var tempArr=new Array()
    tempArr=this.shiftLinesScheduleSelected
    this.all_final_data_shiftline_length=new Array()
    for(var i=0;i<tempArr.length;i++){
      for(var j=0;j<this.newBidSchedule.shiftdefmap.length;j++){
        if(tempArr[i].sh_schedule_id==this.newBidSchedule.shiftdefmap[j].shiftdefref){
          this.all_final_data_shiftline_length.push({"scheduleName":tempArr[i].schedulename,"totalShiftlines":tempArr[i].schild.length})
        }
      }
    }
    var tempArr=[]
    tempArr=this.all_final_data_shiftline_length
    this.all_final_data_shiftline_length=[]
    if(this.totalEmpSelected>0){
      this.check_correct_shitline_schedule=false
      for(var i=0;i<tempArr.length;i++){
        if(tempArr[i].totalShiftlines<this.totalEmpSelected){
          this.all_final_data_shiftline_length.push(tempArr[i])
          this.check_correct_shitline_schedule=true
        }
      }
    }
  }

  allShiftlinesData(){

    this.bidShiftLineSer.getBidShiftlinesData(this.bid_schedule_name).subscribe((res)=>{
      var temp=res
      for(var i=0;i<temp.length;i++){
        if(temp[i].bidschidref===Number(this.view_bid_schedule_id)){
          this.bid_shiftline.push(temp[i].bidid)
        }
      }
    },(err)=>{console.log(err)},()=>{})
  }
  viewBidScheduleData(){
    this.bidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.view_bid_schedule_id).subscribe((res)=>{

      this.newBidSchedule=res
    },(err)=>{},()=>{})
  }
  async selectShiftlineSchedule(){
      const modal = await this.modalCtrl.create({
        component: SelectShiftlineComponent,
        cssClass: 'bidShiftLineSchedule',
        componentProps:{editBidSchedule:true},
        swipeToClose:true
      });
      modal.onDidDismiss()
      .then((data) => {
        this.ngOnInit()
    });

    return await modal.present();
  }
  slotsValidated(){
    this.slotsValid = true;
  }
  slotsLoaded(data){
    this.totalCreatedVacationHours = data.totalHours;
    this.totalRequiredVacationHours = Number(this.localData.getItem('edittotalRequiredVacationHours'));
    this.localData.setItem('edittotalCreatedVacationHours',this.totalCreatedVacationHours);
  }
  getAllEmployeeList(){
    this.totalAccumulatedLeaves = 0;
    this.getAllEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res)=>{this.allEmployee=res
        this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)
        },(err)=>{console.log(err)},()=>{})
      var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))
      this.all_Employee=[]
      var count=0
      for(var i=0;i<tempObj.employeemap.length;i++){
        count++
        this.getAllEmp.getEmpDataBasedOnEmpId(tempObj.employeemap[i].empidref).subscribe(
          (res)=>{
            this.all_Employee.push(res)
            this.all_Employee = this.all_Employee.sort((a, b) => a.rank - b.rank)
            this.totalRequiredHours += +(+Number(res.vacation));
            this.totalAccumulatedLeaves += +(+Number(res.accumulatedleave || 0));
//             this.all_Employee = this.all_Employee.filter((value, index, self) =>
//   index === self.findIndex((t) => (
//     t.place === value.place && t.name === value.name
//   ))
// )
            // if(count==tempObj.employeemap.length){
            //   this.createBidROundData(tempObj.roundmap)
            // }
          },(err)=>{console.log(err)},()=>{})

      }
      //
  }
  employeeSelected(data){
    this.compareChange();
    this.newBidSchedule.employeemap = data.updatedEmployeeMap;
    this.totalRequiredVacationHours=data.totalRequired
    this.totalAccumulatedLeaves = data.totalAccumulatedLeaves;
    this.localData.setItem(
      'edittotalAccumulatedLeaves',
      this.totalAccumulatedLeaves
    )
    this.localData.setItem('edittotalRequiredVacationHours',JSON.stringify(this.totalRequiredVacationHours))
    var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))
    if(tempObj!=null && tempObj.roundmap.length>0 && data.updatedValue){
      this.checkValuechanged=true
      this.addNewBidRound()
    }
    this.loadData()
  }
  async selectEmp(){
    const modal = await this.modalCtrl.create({
      component: SelectEmployeeComponent,
      cssClass: 'bidVacation',
      componentProps:{editBidSchedule:true},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => this.employeeSelected(data.data));
    return await modal.present();
  }
  compareChange(){
    this.isUpdated = !isEqual(this.prevState, JSON.parse(this.localData.getItem('editBidSchedule')));
  }
  updateSelectedSlots(data){
    this.compareChange();
    this.totalCreatedVacationHours = data.totalHours;
    this.totalAccumulatedLeaves = data.totalAccumulatedLeaves;
    this.localData.setItem(
      'edittotalCreatedVacationHours',
      JSON.stringify(this.totalCreatedVacationHours)
    );
    this.localData.setItem(
      'edittotalAccumulatedLeaves',
      JSON.stringify(this.totalAccumulatedLeaves)
    );
    var tempObj = JSON.parse(this.localData.getItem('editBidSchedule'));
    this.slotsValid = true;

    if (tempObj != null && tempObj.roundmap.length > 0) {
      this.checkValuechanged = true;
      this.addNewBidRound();
    } else {
      this.loadData();
    }
  }
  async addNewSlot(){
    const modal = await this.modalCtrl.create({
      component: SelectVacationSlotsComponent,
      cssClass: 'bidVacation',
      componentProps:{editBidSchedule:true},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => this.updateSelectedSlots(data.data));

  return await modal.present();
  }
  showHide(){
    if(this.empHide==false){
      this.empHide=true
    }else{
      this.empHide=false
    }
  }
  getEmpInitial(empId){
    for(var i=0;i<this.allEmployee.length;i++){
      if(empId==this.allEmployee[i].empid){
        return this.allEmployee[i]
      }
    }
  }
  shiftsUpdated(){
    this.compareChange();
    this.loadData();
  }
  async viewIncorrectShiftlineScheduleData(){
    console.log(this.all_final_data_shiftline_length)
    const modal = await this.modalCtrl.create({
      component: IncorrectShiftlineScheduleMessageComponent,
      cssClass: 'saveBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps:{all_final_data_shiftline_length:this.all_final_data_shiftline_length,totalEmp:this.totalEmpSelected},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => {
  });
  return await modal.present();
  }
  async showRecomputeAlert(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: 'Please re-compute the bid rounds. You updated the data.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Ok',
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
  selectBidRound(){
    this.compareChange();
    this.checkValuechanged=false
    this.loadData()
  }
  async addNewBidRound(){
    if(!this.isDesktop){
      const modal = await this.modalCtrl.create({
        component: SelectBidRoundsComponent,
        cssClass: 'bidRounds',
        componentProps:{checkValuechanged:this.checkValuechanged,editBidSchedule:true,totalCreatedVacationHours:this.totalCreatedVacationHours,totalRequiredVacationHours:this.totalRequiredVacationHours},
        swipeToClose:true
      });
      modal.onDidDismiss()
      .then(() => this.selectBidRound());

    return await modal.present();
    }else{
      this.shiflinePanel.close();
      this.employeePanel.close();
      this.vacationSlotsPanel.open();
      this.bidRoundPanel.open();
      this.bidRoundPanelElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
      this.showRecomputeAlert();
    }
  }
  checkExcludeWeekend=true
  async beforecontinue(){
    this.newBidSchedule = JSON.parse(this.localData.getItem('editBidSchedule'));
    if(this.newBidSchedule!=undefined){
      if(this.newBidSchedule.roundmap!=undefined){
        if(this.newBidSchedule.roundmap.length>0){
          var  rmap=this.newBidSchedule.roundmap
          rmap=rmap.sort((a,b)=>{return Number(a.roundseq_id) -Number(b.roundseq_id)})
          var startDate=rmap[0].roundstartdate.split('T')[0]
          var startTimme=rmap[0].roundstarttime

          if(this.bidShculeTimeZone==undefined || this.bidShculeTimeZone==null || this.bidShculeTimeZone==''){
            this.bidShculeTimeZone='US/Eastern'
          }else{
            this.bidShculeTimeZone=this.newBidSchedule.timezone
          }
              var todayCheck,date,invdate,diff
              date = new Date();
              invdate = new Date(date.toLocaleString('en-US', {
                timeZone: this.bidShculeTimeZone
              }));
              diff = date.getTime() - invdate.getTime();
              todayCheck=new Date(date.getTime() - diff)

          if(new Date(Number(startDate.split('-')[0]),Number(startDate.split('-')[1])+ - +1,Number(startDate.split('-')[2]),Number(startTimme.split(':')[0]),Number(startTimme.split(':')[1]),0).getTime()<todayCheck.getTime()){
            if(new Date(Number(startDate.split('-')[0]),Number(startDate.split('-')[1])+ - +1,Number(startDate.split('-')[2]),0,0,0).getTime()<new Date(todayCheck.getFullYear(),todayCheck.getMonth(),todayCheck.getDate(),0,0,0).getTime()){
              this.checkPastTimeOrDateOne='date'
              this.checkPastTimeOrDateTwo='date'
            }else{
             this.checkPastTimeOrDateOne='start time'
              this.checkPastTimeOrDateTwo='time'
            }
          this.checkPastTimeAndDate=true
          }else{
            this.checkPastTimeAndDate=false
          }
        }
      }
    }
    if(this.checkPastTimeAndDate==false){
      const confirm = await this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'Are you sure want to update the Bid Schedule Details?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'Yes',
            role: 'ok',
            handler: () => {
              this.continue()
            }
          }]
          })
          await confirm.present();
    }


  }
  async continue(){
    var tempObj=JSON.parse(this.localData.getItem('editBidSchedule'))

    if(tempObj!=null){
    var finalArrShiftLineSchedule=[],finalArrVacationLeave=[],finalArrBidRound=[],finalArrEmp=[]

    var total_leave=0,total_round=0
    total_leave= tempObj.leavemap.length
    total_round=tempObj.roundmap.length
    var leaveStatus=0,roundStatus=0,scheduleStatus=0
    var bidScheduleStartDate,bidScheduleEndDate
    if(total_round>0){
      roundStatus=1
      bidScheduleStartDate=tempObj.roundmap[0].roundstartdate
      bidScheduleEndDate=tempObj.roundmap[(total_round+ - +1)].roundenddate
    }
    if(total_leave>0){
      leaveStatus=1
    }
    if(tempObj.shiftdefmap.length>0 && tempObj.employeemap.length>0){
      scheduleStatus=1
    }
    var checkExcludeWeekend=1
    this.checkExcludeWeekend=true
    if(tempObj.weekendstatus==true){
      checkExcludeWeekend=1
      this.checkExcludeWeekend=false

    }else{
      this.checkExcludeWeekend=true
      checkExcludeWeekend=0
    }
    // if(scheduleStatus==1){
    //   if(this.check_correct_shitline_schedule==true){
    //     scheduleStatus=0
    //   }else{
    //     scheduleStatus=scheduleStatus
    //   }
    // }
    this.bid__ScheduleName=tempObj.bidschename
    var finalObj = {
      bidschid: this.view_bid_schedule_id,
      bidschename: tempObj.bidschename,
      intervalstarttime: tempObj.intervalstarttime,
      intervalduration: tempObj.intervalduration,
      hasinterval: tempObj.hasinterval,
      bidroundoption: tempObj.bidroundoption,
      timezone: tempObj.timezone,
      weekendstatus: checkExcludeWeekend,
      bidmanagerid: this.user_data.id,
      bidschstartdate: bidScheduleStartDate,
      bidschenddate: bidScheduleEndDate,
      schedulesavestatus: scheduleStatus,
      leavesavestatus: leaveStatus,
      roundsavestatus: roundStatus,
      totalbidleaves: total_leave,
      totalbidrounds: total_round,
      shiftdefmap: tempObj.shiftdefmap,
      employeemap: tempObj.employeemap,
      leavemap: tempObj.leavemap,
      roundmap: tempObj.roundmap,
    };

  }
  // this.createBidROundData(finalObj.roundmap)

    this.bidScheduleSer.updateBidSchedule(this.view_bid_schedule_id,finalObj).subscribe((res)=>{
      this.bidScheduleSer.deletenullvalue(0).subscribe((res)=>{},
      (err)=>{console.log(err)},()=>{})
      this.createBidROundData(finalObj.roundmap)
      this.bidShiftLineTable(finalObj.shiftdefmap,finalObj.bidschename)
      this.emailNotify.whenBidManagerUpdateTheNewBidSchedule(this.view_bid_schedule_id).subscribe((res)=>{

      },(err)=>{console.log(err)},()=>{})
      this.localData.removeItem('editBidSchedule')

              Swal.fire({
            title: 'Success!',
            html: 'Your bid schedule is saved!',
            icon: 'success',
            showCancelButton: false,
            imageHeight:'250px',
            heightAuto:false,
            confirmButtonColor:'#ff6700',
          }).then((result) => {
            this.navCtrl.navigateBack(straightlines_io_apis.apis.manage_bid_schedule)
          })
                },(error)=>{
                  // this.localData.removeItem('editBidSchedule')
                  // this.navCtrl.navigateBack(straightlines_io_apis.apis.manage_bid_schedule)
                  console.log(error)
                  Swal.fire({
                    title: 'Error!',
                    html: 'Please try again later!',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor:'#ff6700',
                    imageHeight:'250px',
                    heightAuto:false,
                  }).then((result) => {
                  })

                },()=>{

                      this.modalCtrl.dismiss()
                })

  }
  async viewBidRoundList(){
  const modal = await this.modalCtrl.create({
    component: BidRoundSummaryComponent,
    cssClass: 'shiftlineSummaryForBidSchedule',
    // componentProps: { schedule_data:data,schedule_id:id},
    componentProps:{view_bid_schedule_id:this.view_bid_schedule_id,editBidSchedule:true},
    swipeToClose:true
  });
  modal.onDidDismiss()
  .then((data) => {
});

return await modal.present();
}
  async showShiftLineScheduleSummary(){
     const modal = await this.modalCtrl.create({
      component: SelectShiftlineScheduleSummaryComponent,
      cssClass: 'shiftlineSummaryForBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},
      componentProps:{view_bid_schedule_id:this.view_bid_schedule_id,editBidSchedule:true},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => {
  });

  return await modal.present();
  }
  async viewEmpList(){
    const modal = await this.modalCtrl.create({
      component: SelectedEmployeeSummaryComponent,
      cssClass: 'shiftlineSummaryForBidSchedule',
      // componentProps: { schedule_data:data,schedule_id:id},

      componentProps:{view_bid_schedule_id:this.view_bid_schedule_id,editBidSchedule:true},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => {
  });

  return await modal.present();
  }
  async viewVacationSlot(){
    const modal = await this.modalCtrl.create({
     component: SelectVacationSlotSummaryComponent,
     componentProps:{view_bid_schedule_id:this.view_bid_schedule_id,editBidSchedule:true},
     cssClass: 'shiftlineSummaryForBidSchedule',
     swipeToClose:true
   });
   modal.onDidDismiss()
   .then((data) => {
 });

 return await modal.present();
 }





















close(){
  this.modalCtrl.dismiss()
}

//Shiftline
shiftlineTableArray
checkID(id,sl,scheduleShift){
  var tempArr=[]
  for(var i=0; i<=scheduleShift.length;i++)
  {
    if(scheduleShift[i] !=undefined){
    if(String(scheduleShift[i].shiftname) == String(sl) || String(scheduleShift[i].shiftname)  == String((sl+'-A'))){
     tempArr.push(Number(scheduleShift[i].seq_id))
    }
    }
  }
  tempArr=tempArr.sort((a,b)=>{return a -b})
  var newid=tempArr.indexOf(id)
  return newid
}
bidShiftLineTable(finalObj,bidsname){
  this.shiftlineTableArray=new Array()
  var tempObj,index=0

  for(var i=0;i<finalObj.length;i++){
  this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(finalObj[i].shiftdefref).subscribe((res)=>{
    index++
    var result=res
    for(var k=0;k<res[0].schild.length;k++){

      tempObj={
        "bidstatus": "Eligible",
        "windowstatus": "",
        "empwindowduration": null,
        "empwindowstartdateandtime": "",
        "bidschidref":this.view_bid_schedule_id,
        "bidschename":bidsname,
        "empidref": '',
        "initials": "",
        "roundseq_id": 1,
        "schedulename": result[0].schedulename,
        "shiftseq_id": k+ + +1,
        "shiftname":result[0].schild[k].shiftname+'-'+(Number(this.checkID(result[0].schild[k].seq_id,result[0].schild[k].shiftname,result[0].schild))+ + +1),
        "pattern": result[0].schild[k].pattern,
        "shiftidref":result[0].sh_schedule_id,
        "shiftlineidref":result[0].schild[k].sh_line_id
      }
      this.shiftlineTableArray.push(tempObj)

    }

    var tempArr=[]
    for(var i=0;i<this.shiftlineTableArray.length;i++){
      if(i<this.bid_shiftline.length){
        tempObj={
          "bidid":this.bid_shiftline[i],
          "bidstatus": "Eligible",
          "windowstatus": "",
          "empwindowduration": null,
          "empwindowstartdateandtime": "",
          "bidschidref":this.view_bid_schedule_id,
          "bidschename":bidsname,
          "empidref": '',
          "initials": "",
          "roundseq_id": 1,
          "schedulename":this.shiftlineTableArray[i].schedulename,
          "shiftseq_id": this.shiftlineTableArray[i].shiftseq_id,
          "shiftname":this.shiftlineTableArray[i].shiftname,
          "pattern": this.shiftlineTableArray[i].pattern,
          "shiftidref":this.shiftlineTableArray[i].shiftidref,
          "shiftlineidref":this.shiftlineTableArray[i].shiftlineidref
        }
      }else{
        tempObj={
          "bidid":'',
          "bidstatus": "Eligible",
          "windowstatus": "",
          "empwindowduration": null,
          "empwindowstartdateandtime": "",
          "bidschidref":this.view_bid_schedule_id,
          "bidschename":bidsname,
          "empidref": '',
          "initials": "",
          "roundseq_id": 1,
          "schedulename":this.shiftlineTableArray[i].schedulename,
          "shiftseq_id": this.shiftlineTableArray[i].shiftseq_id,
          "shiftname":this.shiftlineTableArray[i].shiftname,
          "pattern": this.shiftlineTableArray[i].pattern,
          "shiftidref":this.shiftlineTableArray[i].shiftidref,
          "shiftlineidref":this.shiftlineTableArray[i].shiftlineidref
        }
      }
      tempArr.push(tempObj)
    }
    if(index===finalObj.length){this.finalSubmit(tempArr)}

  },(err)=>{console.log(err)},()=>{})
}

}
finalSubmit(arr){
  var arr1=[],arr2=[],arr3=[]
  for(var i=0;i<arr.length;i++){
    if(arr[i].bidid==''){
      arr1.push(arr[i])
    }else{
      arr2.push(arr[i])
    }
  }

  var index=0
    this.bidShiftLineSer.updateBidShiftlineDataArray(arr2).subscribe((res)=>{

    },(err)=>{console.log(err)},()=>{})
    this.bidShiftLineSer.saveBidShiftlinesData(arr1).subscribe((res)=>{

    },
      (err)=>{console.log(err)},()=>{})

      if(Number(arr.length)<this.bid_shiftline.length){
        for(var i=Number(arr.length);i<this.bid_shiftline.length;i++){
              this.bidShiftLineSer.deleteBidShiftlineData(this.bid_shiftline[i]).subscribe((res)=>{

            },
              (err)=>{console.log(err)},()=>{})
        }
      }
}
convertTime(time) {
  time=new Date(time)
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();
  if(h<10){
    h='0'+h
  }
  if(m<10){
    m='0'+m
  }
  return h+":"+m+":00"
}



tConvert (time12h) {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}
formatDate(date) {
  date=new Date(date)
  var d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}

  createBidROundData(all_SBP_rounds){
      var tempArr=[]
      this.allRoundInfo=all_SBP_rounds
      var startDate,endDate,startTime,endTime,duration,leaveRule
          startDate=all_SBP_rounds[0].roundstartdate
          startTime=all_SBP_rounds[0].roundstarttime
          endTime=all_SBP_rounds[0].roundendttime
          this.totalEmp=this.all_Employee.length
        this.totalDefaultEmp=this.totalEmp
          var sDate,finalArr=[],remaining_mins=0
          this.totalEmp=this.totalDefaultEmp
          tempArr=[]
        var startT=startTime.split(':')
        var endT=endTime.split(':')
        var start,end,endD

            start=startDate.split('T')
            end=startDate.split('T')
            start=start[0].split("-")
            end=end[0].split("-")
            var s=new Date(Number(start[0]),Number(start[1])+ - +1, start[2],Number(startT[0]), Number(startT[1]), 0)
            endD=new Date(Number(start[0]),Number(start[1])+ - +1, start[2],Number(startT[0]), Number(startT[1]), 0)
            var e=new Date(Number(end[0]),Number(end[1])+ - +1, end[2],Number(endT[0]), Number(endT[1]), 0)
      var tempNewArr=[],arr=[]
      this.all_window_data=[]
      var defaultstart,defaultend
      defaultstart=s,defaultend=e



      var defaultstart,defaultend
      defaultstart=s,defaultend=e
      for(var i=0;i<this.allRoundInfo.length;i++){


          if(defaultstart.getTime()>=defaultend.getTime()){
            if(e.getDay()===6 && this.checkExcludeWeekend==false){
              e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +2,Number(endT[0]), Number(endT[1]), 0)
            }

          }
          var temp

          var duration
          duration=this.allRoundInfo[i].roundduration.split(':')
          duration=Number(duration[1])+Number(duration[0])*60
          arr=[]
          for(var j=0;j<this.totalEmp;j++){
            if( j==0 ){
              endD.setMinutes(endD.getMinutes() + Number(duration));
              if(s.getTime()<e.getTime() && endD.getTime()<=e.getTime()){
              }else{
                start=this.formatDate(s);end=this.formatDate(e)
                start=start.split("-");end=end.split("-")
                if(defaultstart.getTime()>defaultend.getTime()){
                  s=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                  e=new Date(e.getFullYear(),e.getMonth(),e.getDate()+ + +1,Number(endT[0]), Number(endT[1]), 0)
                  endD=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                }else{
                  s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                  e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +1,Number(endT[0]), Number(endT[1]), 0)
                  endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                }
                endD.setMinutes( endD.getMinutes() + Number(duration) );
              }
              if(s.getTime()<=e.getTime()){
                if(s.getTime()<e.getTime()){
                  if((j+ + +1)!=this.totalEmp){
                    // endD.setMinutes(endD.getMinutes() + Number(duration));
                    temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                    arr.push(temp)
                    this.all_window_data.push(temp)
                  }else{
                    // endD.setMinutes(endD.getMinutes() + Number(duration));
                    temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                    s.setMinutes(s.getMinutes() + Number(duration));
                    arr.push(temp)
                    this.all_window_data.push(temp)
                  }
              }else{
                start=this.formatDate(s);end=this.formatDate(e)
                start=start.split("-");end=end.split("-")
                s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +1,Number(endT[0]), Number(endT[1]), 0)
                endD.setMinutes( endD.getMinutes() + Number(duration) );
                temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                arr.push(temp)
                this.all_window_data.push(temp)
              }
            }
          }else{
            if((j+ + +1)==this.totalEmp){
              if(endD.getTime()==e.getTime()){
                start=this.formatDate(s);end=this.formatDate(e)
                start=start.split("-");end=end.split("-")
                s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +1,Number(endT[0]), Number(endT[1]), 0)
                endD.setMinutes( endD.getMinutes() + Number(duration) );
                temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                arr.push(temp)
                this.all_window_data.push(temp)
              }else{
                s.setMinutes( s.getMinutes() + Number(duration) );
                endD.setMinutes(endD.getMinutes() + Number(duration));
                if(s.getTime()<e.getTime() && endD.getTime()<=e.getTime()){
                  temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                  arr.push(temp)
                  this.all_window_data.push(temp)
                  s.setMinutes(s.getMinutes() + Number(duration));
                }else{
                  start=this.formatDate(s);end=this.formatDate(e)
                  start=start.split("-");end=end.split("-")
                          if(defaultstart.getTime()>defaultend.getTime()){
                            s=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                            e=new Date(e.getFullYear(),e.getMonth(),e.getDate()+ + +1,Number(endT[0]), Number(endT[1]), 0)
                            endD=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                          }else{
                            s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                            e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +1,Number(endT[0]), Number(endT[1]), 0)
                            endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                          }

                  endD.setMinutes( endD.getMinutes() + Number(duration) );
                  temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                  arr.push(temp)
                  this.all_window_data.push(temp)
                  s.setMinutes( s.getMinutes() + Number(duration) );
                }
              }
            }else{
              s.setMinutes(s.getMinutes() + Number(duration));
              endD.setMinutes(endD.getMinutes() + Number(duration));
              if(s<e && endD<=e){
                temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}
                arr.push(temp)
                this.all_window_data.push(temp)
              }else{
                start=this.formatDate(s);end=this.formatDate(e)
                start=start.split("-");end=end.split("-")
                        if(defaultstart.getTime()>defaultend.getTime()){
                          s=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                          e=new Date(e.getFullYear(),e.getMonth(),e.getDate()+ + +1,Number(endT[0]), Number(endT[1]), 0)
                          endD=new Date(s.getFullYear(),s.getMonth(),s.getDate(),Number(startT[0]), Number(startT[1]), 0)
                        }else{
                          s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                          e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +1,Number(endT[0]), Number(endT[1]), 0)
                          endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +1,Number(startT[0]), Number(startT[1]), 0)
                          if(s.getDay()===6 && this.checkExcludeWeekend==false){
                            s=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +3,Number(startT[0]), Number(startT[1]), 0)
                            e=new Date(Number(end[0]),Number(end[1])+ - +1, Number(end[2])+ + +3,Number(endT[0]), Number(endT[1]), 0)
                            endD=new Date(Number(start[0]),Number(start[1])+ - +1, Number(start[2])+ + +3,Number(startT[0]), Number(startT[1]), 0)
                          }
                        }
                endD.setMinutes( endD.getMinutes() + Number(duration) );

                temp={"round":i+ + +1,"empName":'',"empInitial": "","status": 0,"bid_duration":duration,"startDate":String(s),"endDate":String(endD),'id':j+ + +1}

                arr.push(temp)
                this.all_window_data.push(temp)
              }
            }
          }
        }

        tempArr.push({"Round":i+ + +1,"RoundData":arr})
      }


      // this.updatedroundForm()
      this.all_bid_WindoRound_data=tempArr


      this.allbidWindoRoundData()
    }
    allbidWindoRoundData(){
      var totalEmp=this.all_Employee.length
      var tempObj,tempArr=[]

      var totalCount=0
      var count=0


      for(var j=0;j<this.all_bid_WindoRound_data.length;j++){
        // tempArr=[]


          for(var i=0;i<this.all_bid_WindoRound_data[j].RoundData.length;i++){
            totalCount++
            count++
            if(totalCount<=this.all_bid_windows_id.length){
              if(i<totalEmp){

                          tempObj={
                            "duid":this.all_bid_windows_id[totalCount+ - +1],
                            "initials":this.all_Employee[i].initials,
                            "rank": this.all_Employee[i].rank,
                            "bidschidref":this.view_bid_schedule_id,
                            "empidref":this.all_Employee[i].empid,
                            "roundseq_id": this.all_bid_WindoRound_data[j].Round,
                            "bidschename":this.bid__ScheduleName,
                            "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
                            "shiftlinebidstatus": "Eligible",
                            "fname": this.all_Employee[i].fname,
                            "lname":this.all_Employee[i].lname,
                            "empseq_id": i+ + +1,
                            "trans_seq_id":count,
                            "vacationbidstatus":"Eligible",
                            "empbid_start_time":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate) +' ' + this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "empbid_end_time":this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate)+ ' '+this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate)
                          }

                        }else{
                          tempObj={
                            "duid":this.all_bid_windows_id[totalCount + - +1],
                            "initials":'',
                            "rank": '',
                            "bidschidref":this.view_bid_schedule_id,
                            "empidref":'',
                            "roundseq_id": this.all_bid_WindoRound_data[j].Round,
                            "bidschename":this.bid__ScheduleName,
                            "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
                            "shiftlinebidstatus": "Eligible",
                            "fname": '',
                            "lname":'',
                            "trans_seq_id":count,
                            "vacationbidstatus":"Eligible",
                            "empseq_id": i+ + +1,
                            "empbid_start_time":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate) +' ' + this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "empbid_end_time":this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate)+ ' '+this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate)
                          }

                        }
                      }else{
                        if(i<totalEmp){
                          tempObj={
                            "initials":this.all_Employee[i].initials,
                            "rank": this.all_Employee[i].rank,
                            "bidschidref":this.view_bid_schedule_id,
                            "empidref":this.all_Employee[i].empid,
                            "roundseq_id": this.all_bid_WindoRound_data[j].Round,
                            "bidschename":this.bid__ScheduleName,
                            "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
                            "shiftlinebidstatus": "Eligible",
                            "trans_seq_id":count,
                            "vacationbidstatus":"Eligible",
                            "fname": this.all_Employee[i].fname,
                            "lname":this.all_Employee[i].lname,
                            "empseq_id": i+ + +1,
                            "empbid_start_time":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate) +' ' + this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "empbid_end_time":this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate)+ ' '+this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate)
                          }

                        }else{
                          tempObj={
                            "initials":'',
                            "rank": '',
                            "bidschidref":this.view_bid_schedule_id,
                            "empidref":'',
                            "roundseq_id": this.all_bid_WindoRound_data[j].Round,
                            "bidschename":this.bid__ScheduleName,
                            "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
                            "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
                            "shiftlinebidstatus": "Eligible",
                            "vacationbidstatus":"Eligible",
                            "fname": '',
                            "lname":'',
                            "trans_seq_id":count,
                            "empseq_id": i+ + +1,
                            "empbid_start_time":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate) +' ' + this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
                            "empbid_end_time":this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate)+ ' '+this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate)

                          }

                        }
                      }
            tempArr.push(tempObj)
          }

      }
      if(this.all_bid_windows_id.length>tempArr.length){
        for(var i=tempArr.length;i<this.all_bid_windows_id.length;i++){

        }
      }
      var arr=[]
      if(tempArr.length<this.all_bid_windows_id.length){
        for(var i=tempArr.length;i<this.all_bid_windows_id.length;i++){

          this.bidWindowSer.deleteWindowTranData(this.all_bid_windows_id[i]).subscribe((res)=>{

          },(err)=>{console.log(err)},()=>{})
        }
      }
      for(var i=0;i<tempArr.length;i++){
        if(tempArr[i].duid=='' || tempArr[i].duid==undefined || tempArr[i].duid==null){
          this.bidWindowSer.createNewBidSchedule([tempArr[i]]).subscribe((res)=>{
          },(err)=>{console.log(err)},()=>{})
        }else{
          if(tempArr[i].duid !=undefined){
                  this.bidWindowSer.updateBidWindowData(tempArr[i].duid,tempArr[i]).subscribe((res)=>{
                },(err)=>{console.log(err)},()=>{})
              }else{
                this.bidWindowSer.createNewBidSchedule([tempArr[i]]).subscribe((res)=>{
                },(err)=>{console.log(err)},()=>{})
              }
        }
      }

    }

}

