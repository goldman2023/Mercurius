import { ChangeDetectorRef, Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Workbook } from 'exceljs';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MyBiddingService } from '../my-bidding.service';
import * as fs from 'file-saver';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { ScheduleLeaveSummaryService } from 'src/app/services/manage-bid-schedule/schedule-leave-summary.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';
import { LocalDataService } from 'src/app/services/data/local-data.service';

@Component({
  selector: 'app-schedule-leave-summary',
  templateUrl: './schedule-leave-summary.component.html',
  styleUrls: ['./schedule-leave-summary.component.scss'],
})
export class ScheduleLeaveSummaryComponent implements OnInit {

  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  spinner=true
allUpdatedShiftLine=[]
  bid_schedule_name
  shiftLineData
    all_shift_lines=[]
  customPopoverOptions: any = {
   cssClass:'custom-popover'
  };
  checkShiftLineScheduleId=0
  bid_schedule=[]
  bid_scheduleName=[]
  years=[]
  all_employee=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R']
  selectShiftLineForm
  schedule_id: number=0;
  step_form_name
  empName="VP"
  bidShculeTimeZone='US/Eastern'
  checkData=true
    selectYearForm: FormGroup;
    selectBidScheduleNameForm: FormGroup;
  selected_schedule_for_bidding: any;
  Start_Date: any;
  Window_Start: any;
  Window_Duration: any;
  Schedule_Name: any;
  all_bid_schedule: any;
  count_emp_select_shiftLine: number=0;
  all_SBP_rounds=[];
  allScheduleData: any[];
  all_final_data: any[];
  current_shift_line_schedule: any;
  current_shift_line_schedule_startDate: any;
  current_shift_line_schedule_endDate: any;
  all_selected_schedule_shift_lines: any[];
  expand_id: any;
  bidSchedule
  bid_shiftline=[]
  shiftLinesSchedule=[]
  shiftlineScheduleData
  all_Bid_schedule_list=[]
  currentBidScheduleData
  user_data
  rowCount=0
  checkBidShceduleInProgress=false
  totalEmployee=0
  scheduleStartDate
  scheduleEndDate
  totalBidRounds=0
  _nextId
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  defChars='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  _chars
  bidding_status
  bid_schedule_length=0
  round_id=0
  managerIds=[]
  showPopUp: any;
    constructor(
      public navCtrl: NavController,
      public formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      public alertController: AlertController,
      private bidService:BidScheduleService,
      private headerTitleService: HeaderTitleService,
      private bidShiftLineSer:BidShiftlinesService,
      private myBiddingSer:MyBiddingService,
      private fb:FormBuilder,
      private bidWindowSer:BidWindowService,
      private cd: ChangeDetectorRef,
      public loadingController: LoadingController,
      private bidLeaveSer:BidVacationLeaveService,
      private route: ActivatedRoute,
      private empSer:AddNewEmployeeService,
      private ScheduleLeaveSummarySer:ScheduleLeaveSummaryService,
      private newBidScheduleSer:CreateNewBidScheduleService,
      private scheduleService:GeneratedScheduleService,
      private http: HttpClient,
      private localData: LocalDataService
    ) {
      this._chars = this.chars;
      this._nextId = [0];

    this.route.params.subscribe(params => {

      this.bid_schedule_name = params['_bidScheduleName'];
      this.round_id = params['_rid'];
      this.passBidScheduleName.emit(this.bid_schedule_name)
      this.passroundId.emit(this.round_id)
  });
     }

  ngOnInit() {
    this.spinner =true
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.headerTitleService.setTitle('My Bidding');
    this.passBidScheduleName.emit(this.bid_schedule_name)
    this.passroundId.emit(this.round_id)
    this.managerIds.push(this.user_data.id)
    if(this.user_data.managerId!=null && this.user_data.managerId!=undefined){
      this.managerIds.push(this.user_data.managerId)
    }
    this.headerTitleService.setDefaultHeader(false)
    this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? straightlines_io_apis.apis.employee_home : straightlines_io_apis.apis.my_bidding);
    this.headerTitleService.setForwardUrl(null);
    this.headerTitleService.checkBiddingTime('biddingheader')
    this.myBiddingSer.setTitle('viewScheduleLeaveSummary')
    this.checkShiftLineScheduleId= JSON.parse(this.localData.getItem('selectShiftLineForBidding'))
    if(this.checkShiftLineScheduleId==null){
      this.checkShiftLineScheduleId=0
    }
    this.selected_schedule_for_bidding=JSON.parse(this.localData.getItem('myBiddingData'))
    if(this.bid_schedule_name!=='select bid schedule name'){
      this.checkData=true
    this.allShiftlinesData()
    }else{
      this.checkData=false
      this.spinner=false
    }
  }

  allShiftlinesData(){
    this.bidShiftLineSer.getBidShiftlinesData(this.bid_schedule_name).subscribe((res)=>{
      this.bid_shiftline=res
      this.getAllDataBasedOnScheduleName()
    },(err)=>{console.log(err)},()=>{})
  }
bidscheduleStartDate
bidscheduleEndDate

  getAllDataBasedOnScheduleName(){
    this.all_Bid_schedule_list=[]
    var count = 0
    if (this.user_data.role == "emp") {
      this.bidWindowSer.getBidscheduleDetailsBasedonEmpid(this.user_data.empid).subscribe((res) => {
        this.all_Bid_schedule_list = res;
        this.getCurrentBidSchedule()
      })
    } else { 

      for(var i=0;i<this.managerIds.length;i++){
        this.newBidScheduleSer.getAllBidScheduleData(this.managerIds[i]).subscribe((res)=>{
          var temp
          temp=res
          for(var j=0;j<temp.length;j++){
            this.all_Bid_schedule_list.push(temp[j])
          }
          count++
          if(count==this.managerIds.length){
            this.getCurrentBidSchedule()
          }
        },(err)=>{console.log(err)
  
          },()=>{})
      }
    }
  }
  getCurrentBidSchedule(){

      this.bid_schedule_length=this.all_Bid_schedule_list.length
      for(var i=0;i<this.all_Bid_schedule_list.length;i++){
        if(this.all_Bid_schedule_list[i].bidschename===this.bid_schedule_name){
          this.currentBidScheduleData=this.all_Bid_schedule_list[i]
          this.bidSchedule=this.all_Bid_schedule_list[i]
          this.bidShculeTimeZone=this.bidSchedule.timezone
        }
      }

      this.totalEmployee=this.bidSchedule.employeemap.length
      this.scheduleStartDate=new Date(Number(this.bidSchedule.bidschstartdate.split('-')[0]),Number(this.bidSchedule.bidschstartdate.split('-')[1])+ - +1,Number(this.bidSchedule.bidschstartdate.split('-')[2]),0,0,0)
      this.scheduleEndDate=new Date(Number(this.bidSchedule.bidschenddate.split('-')[0]),Number(this.bidSchedule.bidschenddate.split('-')[1])+ - +1,Number(this.bidSchedule.bidschenddate.split('-')[2]),0,0,0)
      this.totalBidRounds=this.bidSchedule.totalbidrounds
      var start,end,dates=[]
      for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
        start=new Date(Number(this.bidSchedule.shiftdefmap[i].shiftdefstartdate.split('-')[0]),Number(this.bidSchedule.shiftdefmap[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.bidSchedule.shiftdefmap[i].shiftdefstartdate.split('-')[2]),0,0,0)
        end=new Date(Number(this.bidSchedule.shiftdefmap[i].shiftdefenddate.split('-')[0]),Number(this.bidSchedule.shiftdefmap[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.bidSchedule.shiftdefmap[i].shiftdefenddate.split('-')[2]),0,0,0)
        dates.push(start)
        dates.push(end)

      }
      dates=dates.sort((a,b)=>{return a.getTime() - b.getTime()})
      if(dates.length>0){
        this.bidscheduleStartDate=dates[0]
        this.bidscheduleEndDate=dates[dates.length+ - +1]
      }
      this.checkBidScheduleStatus()
  }


  async download(){
    if(this.bidding_status==2 || this.bidding_status==1){
      this.nextDownload()
    }
    else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: "No data is available because bidding has not started!!!",
        buttons: [{text:'OK', handler: () => {}}]
      });
      await alert.present();
    }
  }
  async nextDownload(){
   const loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner:'bubbles',
      message: 'Please Wait...',
      duration: 10000,

    });
    await loading.present();
  var temp
  temp={
    "bid_schedule_id": Number(this.bidSchedule.bidschid),
    "start_year":Number(this.bidscheduleStartDate.getFullYear()),
    "start_month": Number(this.bidscheduleStartDate.getMonth())+ + +1,
    "start_day": Number(this.bidscheduleStartDate.getDate()),
    "end_year":   Number(this.bidscheduleEndDate.getFullYear()),
    "end_month":   Number(this.bidscheduleEndDate.getMonth())+ + +1,
    "end_day":   Number(this.bidscheduleEndDate.getDate())
    }

    this.ScheduleLeaveSummarySer.generateScheduleLeaveSummary(temp).subscribe(async (res)=>{
      console.log(res)
      saveAs(res, this.bid_schedule_name+' Schedule Leave Summary.xlsx',
     { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
     await loading.dismiss();
    },async (err)=>{console.log(err)

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Something went wrong. Please try again later!!',
        buttons: [{text:'OK', handler: () => {}}]
      });
      await loading.dismiss();
      await alert.present();

    },()=>{})
  }
  checkBidScheduleStatus(){
    var sName=this.bid_schedule_name
    var today,biddingStartDate,date,invdate,diff
    var tempArr=[],biddingendDate
    var maxDate
    this.bidWindowSer.getBidWindowDataBasedOnScheduleName(this.bid_schedule_name).subscribe((res)=>{
      var temp
      temp=res
      for(var i=0;i<temp.length;i++){
        if(this.bidSchedule.bidschid===temp[i].bidschidref){
              tempArr.push(temp[i])
        }
      }
      tempArr=tempArr.sort((a,b)=>{ return a.trans_seq_id - b.trans_seq_id})


        var start,end,s

            start =tempArr[0].empbid_start_time.split(" ")[0].split('-');
            s=tempArr[0].empbid_start_time.split(" ")[1].split(":")
            biddingStartDate = new Date(start[0],Number(start[1])+ - +1, start[2],s[0] ,s[1], s[2]);

         date = new Date();
        invdate = new Date(date.toLocaleString('en-US', {
          timeZone: this.bidShculeTimeZone
        }));
         diff = date.getTime() - invdate.getTime();
         today=new Date(date.getTime() - diff)
          var e
          end =tempArr[tempArr.length+ - +1].empbid_start_time.split(" ")[0].split('-');
          e=tempArr[tempArr.length+ - +1].empbid_end_time.split(" ")[1].split(":")
          maxDate = new Date(end[0],Number(end[1])+ - +1, end[2],e[0] ,e[1], e[2]);

          if(today.getTime()<biddingStartDate.getTime()){

            this.bidding_status=0
        }else if(today.getTime()>biddingStartDate.getTime()){
          if(today.getTime()<maxDate.getTime()){
            this.bidding_status=2
          }else{
            this.bidding_status=1
          }
        }else{
          this.bidding_status=2
        }

        if(this.bidding_status==2){
          this.round_id=this.round_id
        }else{
          this.round_id=0
        }

  },(err)=>{console.log(err)},()=>{})


    this.getAllShiftLineSchedule()

  }
  getCurrentRound(round_id){
    return Number(round_id) + + +1
  }
  myFunction() {
    this.showPopUp
    // this.checkClickForPopup=true
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");

    var popupStatus= document.getElementById("popup");
    if(popupStatus!=null){
      if(popupStatus.classList.contains("show")==true){
        popupStatus.classList.toggle("show");
      }
    }

  }
  getAllShiftLineSchedule(){
    this.shiftLinesSchedule=new Array()
    this.shiftLinesSchedule=[]
    for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
//
      this.shiftlineScheduleData=res[0]
      this.shiftLinesSchedule.push(this.shiftlineScheduleData)
      this.convertArrayData()

    },(err)=>{console.log(err)},()=>{})
  }
  this.downloadData()
  }
  convertArrayData(){
    var tempArr=new Array()
    tempArr=this.shiftLinesSchedule
    this.all_final_data=new Array()
    this.all_final_data=[]
    for(var i=0;i<tempArr.length;i++){
      for(var j=0;j<this.bidSchedule.shiftdefmap.length;j++){
        if(tempArr[i].sh_schedule_id===this.bidSchedule.shiftdefmap[j].shiftdefref){
          var temp={
            "schedulename":tempArr[i].schedulename,
            "bidschedulestartdate":this.bidSchedule.shiftdefmap[j].shiftdefstartdate,
            "bidscheduleenddate":this.bidSchedule.shiftdefmap[j].shiftdefenddate,
            "shiftdefref":this.bidSchedule.shiftdefmap[j].shiftdefref,
            "bidschid":this.bidSchedule.bidschid,
            "schild":tempArr[i].schild
          }
          this.all_final_data.push(temp)
        }
      }
    }

      this.all_final_data=this.all_final_data.sort(function(a,b){

        return new Date(Number(a.bidschedulestartdate.split('-')[0]),Number(a.bidschedulestartdate.split('-')[1])+ - +1,Number(a.bidschedulestartdate.split('-')[2]),0,0,0).getTime() - new Date(Number(b.bidschedulestartdate.split('-')[0]),Number(b.bidschedulestartdate.split('-')[1])+ - +1,Number(b.bidschedulestartdate.split('-')[2]),0,0,0).getTime() ;
      });
      this.all_final_data= this.all_final_data.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.schedulename === value.schedulename && t.shiftdefref === value.shiftdefref &&  t.bidschedulestartdate === value.bidschedulestartdate && t.bidschid === value.bidschid && t.bidscheduleenddate === value.bidscheduleenddate
        ))
      )

this.spinner =false

  }
  checkCSS(name){
    if(name!=this.empName &&  name!=''){
      return 'deactivate'
    }else{
      return 'active'
    }
  }

  next() {
    const r = [];
    for (const char of this._nextId) {
      r.unshift(this._chars[char]);
    }
    this._increment();
    return r.join('');
  }

  _increment() {
    for (let i = 0; i < this._nextId.length; i++) {
      const val = ++this._nextId[i];
      if (val >= this._chars.length) {
        this._nextId[i] = 0;
      } else {
        return;
      }
    }
    this._nextId.push(0);
  }

  *[Symbol.iterator]() {
    while (true) {
      yield this.next();
    }
  }
  getShiftLineData(sName,shiftId){


  }
  getShift(res){
      var tempResult
      tempResult=res.schild
      var tempArr=[]
      var temp
      this.all_selected_schedule_shift_lines=[]
      for(var i=0;i<tempResult.length;i++){
          temp={
            "id":tempResult[i].sh_line_id,
            "sun":tempResult[i].sun,
            "mon":tempResult[i].mon,
            "tue":tempResult[i].tue,
            "wed":tempResult[i].wed,
            "thu":tempResult[i].thu,
            "fri":tempResult[i].fri,
            "sat":tempResult[i].sat,
            "pattern":tempResult[i].pattern,
            "shiftname":tempResult[i].shiftname,
            "seq_id":tempResult[i].seq_id,
            "selectedBy":''
          }
          this.all_selected_schedule_shift_lines.push(temp)
      }
       tempArr=[]
       var sName=res.schedulename
       var tempObj
          for(var i=0;i<this.bid_shiftline.length;i++){
            for(var j=0;j<this.all_selected_schedule_shift_lines.length;j++){
              if(this.bid_shiftline[i].schedulename==sName && this.bid_shiftline[i].pattern==this.all_selected_schedule_shift_lines[j].pattern && this.bid_shiftline[i].shiftname==(this.all_selected_schedule_shift_lines[j].shiftname+(this.all_selected_schedule_shift_lines[j].seq_id+ + +1))){
                tempObj=  {
                  "scheduleName":this.bid_shiftline[i].schedulename,
                    "id":this.all_selected_schedule_shift_lines[j].id,
                    "bidid":this.bid_shiftline[i].bidid,
                    "sun":this.all_selected_schedule_shift_lines[j].sun,
                    "mon":this.all_selected_schedule_shift_lines[j].mon,
                    "tue":this.all_selected_schedule_shift_lines[j].tue,
                    "wed":this.all_selected_schedule_shift_lines[j].wed,
                    "thu":this.all_selected_schedule_shift_lines[j].thu,
                    "fri":this.all_selected_schedule_shift_lines[j].fri,
                    "sat":this.all_selected_schedule_shift_lines[j].sat,
                    "pattern":this.all_selected_schedule_shift_lines[j].pattern,
                    "shiftname":this.all_selected_schedule_shift_lines[j].shiftname,
                    "seq_id":this.all_selected_schedule_shift_lines[j].seq_id,
                    "selectedBy":this.bid_shiftline[i].initials,
                    "bidstatus":this.bid_shiftline[i].bidstatus,
                    "empidref":this.bid_shiftline[i].empidref,

               }
               tempArr.push(tempObj)
               this.allUpdatedShiftLine.push(tempObj)
              }
            }

          }

  }
  downloadData(){
    this.allUpdatedShiftLine=[]
    this.all_selected_schedule_shift_lines=[]
    this.shiftLinesSchedule=new Array()
    this.shiftLinesSchedule=[]

    for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
      this.shiftlineScheduleData=res[0]
      this.shiftLinesSchedule.push(this.shiftlineScheduleData)

      this.getShift(this.shiftlineScheduleData)
    },(err)=>{console.log(err)},()=>{})
  }

  }
  emp=[]
  downloadSec(){

    var tempArr=[]
    this.emp=[]
    for(var i=0;i<this.bidSchedule.employeemap.length;i++){
      this.getEmp(this.bidSchedule.employeemap[i].empidref,i)
    }
  }
  getEmp(empid,i){
    var temp
    this.empSer.getEmpDataBasedOnEmpId(empid).subscribe((res)=>{

      temp=res
      this.emp.push(temp)
      if((i+++1)==this.bidSchedule.employeemap.length){
        this.getAllLeaveBasedOnBidScheduleName()
      }

    },(err)=>{console.log(err)},()=>{})
  }
  updateData(){

    var tempArr=[],tempArr2=[]
    for(var j=0;j<this.all_final_data.length;j++){
      tempArr=[]
      for(var i=0;i<this.allUpdatedShiftLine.length;i++){
        if(String(this.all_final_data[j].schedulename)===String(this.allUpdatedShiftLine[i].scheduleName)){
          tempArr.push(this.allUpdatedShiftLine[i])
        }
      }

      tempArr2.push(tempArr)
    }
    tempArr=[]
    var arr=[],arrTwo=[],getMaxWeek=0
    this.emp=this.emp.sort((a, b) => a.rank - b.rank)
    var maxValueArr=[],count=0,maxValue=0
    this.all_SBP_rounds=this.bidSchedule.roundmap
    var finalLeaveArr=[]
    for(var i=0;i<this.emp.length;i++){
      for(var m=0;m<this.all_SBP_rounds.length;m++){
        var id
        maxValueArr=[]
            for(var j=0;j<this.get_leave_data.length;j++){
              if(this.emp[i].empid==this.get_leave_data[j].empidref){
                if((m+ + +1)==this.get_leave_data[j].roundseq_id){
                  maxValueArr.push(this.get_leave_data[j])

                }
              }
            }
            if(maxValue<maxValueArr.length){
              maxValue=maxValueArr.length
            }
          }
        }
        for(var i=0;i<this.emp.length;i++){
          for(var m=0;m<this.all_SBP_rounds.length;m++){
            var id
            maxValueArr=[]
                for(var j=0;j<this.get_leave_data.length;j++){
                  if(this.emp[i].empid==this.get_leave_data[j].empidref){
                    if((m+ + +1)==this.get_leave_data[j].roundseq_id){
                      maxValueArr.push(this.get_leave_data[j])

                    }
                  }
                }
                if(maxValueArr.length<maxValue){
                  var diff=0
                  diff=maxValue+ - +maxValueArr.length
                  if(diff>0){
                    for(var n=0;n<diff;n++){
                    maxValueArr.push({"empidref":this.emp[i].empid,'vacationenddate':'XX',"vacationstartdate":'XX',"vcationhours":0})
                  }
                }
              }
              finalLeaveArr.push({"vacation":maxValueArr})
        }
      }
      for(var i=0;i<this.emp.length;i++){
        arr=[],arrTwo=[]
        for(var j=0;j<tempArr2.length;j++){
          for(var k=0;k<tempArr2[j].length;k++){
            if(this.emp[i].empid==tempArr2[j][k].empidref){
              arr.push(tempArr2[j][k])
            }
        }

      }

      arrTwo=[]
      for(var j=0;j<finalLeaveArr.length;j++){
        for(var m=0;m<finalLeaveArr[j].vacation.length;m++){
          if(this.emp[i].empid==finalLeaveArr[j].vacation[m].empidref){
            arrTwo.push(finalLeaveArr[j].vacation[m])
          }
        }
      }
      arrTwo=arrTwo.sort((a, b) => a.vacation_seq_no - b.vacation_seq_no )
      tempArr.push({
        "empName":this.emp[i].fname+' '+this.emp[i].lname,
        "initials":this.emp[i].initials,
        "accruedHours":this.emp[i].vacation,
        "shiftlineData":arr,
        "vacation":arrTwo
      })
    }

    this.exportData(tempArr)
  }
  get_leave_data
  getAllLeaveBasedOnBidScheduleName(){
    this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(this.bidSchedule.bidschid).subscribe((res)=>{
      var temp
      temp=res
      this.get_leave_data=temp
      this.updateData()
    },(err)=>{console.log(err)},()=>{})
  }
  convertDate(date){
    return new Date(Number(date.split('-')[0]),Number(date.split('-')[1])+ - +1,Number(date.split('-')[2]),0,0,0)
  }

  async exportData(data){
    const workbook = new Workbook();
    var temp

    var tempMonth
    var allData=[]
    var defChars
    this.chars=this.defChars
    defChars=this.chars
    this.rowCount=1

    const worksheet = workbook.addWorksheet("Leave Picks by Round");
    const customizedimageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
    const customizedbase64Image = Buffer.from(customizedimageData).toString('base64');
    const logoCustomizedSchedule = workbook.addImage({
      base64: customizedbase64Image,
      extension: 'png',
    });
    worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.1, row: 0.2 },ext: { width: 50, height: 50 } });
    const header = ["#","Name","Initials","Accrued Hours"];

    for(var k=0;k<data.length;k++){
      this._nextId = [0];
      if(k==0){
        for(var l=0;l<data[k].shiftlineData.length;l++){
          header.push(data[k].shiftlineData[l].scheduleName)
        }
        header.push("Total Accrued Hours Picked")
        for(var l=0;l<data[k].vacation.length;l++){
          header.push('Week'+(l+ + +1))
        }
        for(var i=0;i<header.length;i++){
          temp=this.next()
          const defCompT=worksheet.getCell(temp+this.rowCount);
          defCompT.value=header[i]
          // defCompT.alignment={ vertical: 'middle',horizontal: 'center'   }
          defCompT.font = {bold: true};
          defCompT.alignment={ vertical: 'middle',horizontal: 'center' ,wrapText:true  }
          defCompT.border = {
            bottom: {style:'thin'},
              left: {style:'thin'},
              right: {style:'thin'},
              top: {style:'thin'},
            };
        }
      }
      this.rowCount++
      this._chars = defChars;
      this._nextId = [0];


      //Id
      temp=this.next()
      worksheet.getColumn(temp).width=5
      const defCompDataId=worksheet.getCell(temp+this.rowCount);
      defCompDataId.value=k+ + +1
      defCompDataId.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompDataId.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };
      //Name
      temp=this.next()
      worksheet.getColumn(temp).width=15
      const defCompData=worksheet.getCell(temp+this.rowCount);
      defCompData.value=String(data[k].empName)
      defCompData.alignment={ vertical: 'middle', horizontal: 'left' };
      defCompData.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };

      //Initials
      temp=this.next()
      const defCompDataInit=worksheet.getCell(temp+this.rowCount);
      defCompDataInit.value=String(data[k].initials)
      defCompDataInit.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompDataInit.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };
      //TotalHours
      temp=this.next()
      worksheet.getColumn(temp).width=12
      const defCompDataTotalHours=worksheet.getCell(temp+this.rowCount);
      defCompDataTotalHours.value=data[k].accruedHours
      defCompDataTotalHours.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompDataTotalHours.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };
      //shiftlines
      for(var l=0;l<data[k].shiftlineData.length;l++){
        temp=this.next()
        worksheet.getColumn(temp).width=12
        const defCompDataShiftlines=worksheet.getCell(temp+this.rowCount);
        defCompDataShiftlines.value=String(data[k].shiftlineData[l].shiftname+(Number(data[k].shiftlineData[l].seq_id)+ + +1))
        defCompDataShiftlines.alignment={ vertical: 'middle', horizontal: 'center' };
        defCompDataShiftlines.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d8d8d8'}};
        defCompDataShiftlines.border = {
          bottom: {style:'thin'},
            left: {style:'thin'},
            right: {style:'thin'},
            top: {style:'thin'},
          };
           const defCompDataShiftline=worksheet.getCell(temp+1);
          defCompDataShiftline.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d8d8d8'}};
      }
      //Total Accrued Hours Picked
      var sum=0
      for(var l=0;l<data[k].vacation.length;l++){
        sum=sum+ + +data[k].vacation[l].vcationhours

      }
      temp=this.next()
      worksheet.getColumn(temp).width=12
      const defCompDataVacation=worksheet.getCell(temp+this.rowCount);
      defCompDataVacation.value=sum
      defCompDataVacation.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompDataVacation.border = {
        bottom: {style:'thin'},
          left: {style:'thin'},
          right: {style:'thin'},
          top: {style:'thin'},
        };

      //vacation
      for(var l=0;l<data[k].vacation.length;l++){
        temp=this.next()
        worksheet.getColumn(temp).width=12
        const defCompDataVacation=worksheet.getCell(temp+this.rowCount);
        var startDate,endDate
        if(data[k].vacation[l].vacationstartdate=='XX' ||data[k].vacation[l].vacationenddate=='XX'){
          defCompDataVacation.value=String(data[k].vacation[l].vacationstartdate)
        }else{
          startDate=this.convertDate(data[k].vacation[l].vacationstartdate)
          endDate=this.convertDate(data[k].vacation[l].vacationenddate)
          if(startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate() && startDate.getFullYear() === endDate.getFullYear()){
            defCompDataVacation.value=String(startDate.getMonth()+ + +1)+'/'+startDate.getDate()
          }else{
            defCompDataVacation.value=String((startDate.getMonth()+ + +1)+'/'+startDate.getDate()  )+ '-' +(endDate.getMonth()+ + +1)+'/'+endDate.getDate()
          }
        }
        defCompDataVacation.alignment={ vertical: 'middle', horizontal: 'center' };
        defCompDataVacation.border = {
          bottom: {style:'thin'},
            left: {style:'thin'},
            right: {style:'thin'},
            top: {style:'thin'},
          };
      }
    }

  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Leave Picks by Round');
  })
  }

}

