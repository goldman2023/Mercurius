import { ChangeDetectorRef, Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';


@Component({
  selector: 'app-view-bid-shiftlines',
  templateUrl: './view-bid-shiftlines.component.html',
  styleUrls: ['./view-bid-shiftlines.component.scss'],
})
export class ViewBidShiftlinesComponent implements OnInit {
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
  _nextId
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  _chars
  round_id=0
  managerIds=[]
    constructor(
      public navCtrl: NavController,
      public formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      private bidService:BidScheduleService,
      private headerTitleService: HeaderTitleService,
      private bidShiftLineSer:BidShiftlinesService,
      private myBiddingSer:MyBiddingService,
      private fb:FormBuilder,
      private cd: ChangeDetectorRef,
      private bidLeaveSer:BidVacationLeaveService,
      private route: ActivatedRoute,
      private empSer:AddNewEmployeeService,
      private newBidScheduleSer:CreateNewBidScheduleService,
      private scheduleService:GeneratedScheduleService,
      private http : HttpClient,
      private localData: LocalDataService,
      private bidWindowSer:BidWindowService,

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
    this.headerTitleService.setDefaultHeader(false)
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.my_bidding);
    this.headerTitleService.setForwardUrl(null);
    this.headerTitleService.checkBiddingTime('biddingheader')
    this.myBiddingSer.setTitle('viewBidShiftLine')
    this.checkShiftLineScheduleId= JSON.parse(this.localData.getItem('selectShiftLineForBidding'))
    this.managerIds.push(this.user_data.id)
    if(this.user_data.managerId!=null && this.user_data.managerId!=undefined){
      this.managerIds.push(this.user_data.managerId)
    }
    if(this.checkShiftLineScheduleId==null){
      this.checkShiftLineScheduleId=0
    }
    this.selected_schedule_for_bidding=JSON.parse(this.localData.getItem('myBiddingData'))
    if(this.bid_schedule_name!=='select bid schedule name'){
      this.checkData=true
    this.allShiftlinesData()
    }else{
      this.spinner=false
      this.checkData=false
    }
  }
  allShiftlinesData(){

    this.bidShiftLineSer.getBidShiftlinesData(this.bid_schedule_name).subscribe((res)=>{

      this.bid_shiftline=res
      this.getAllDataBasedOnScheduleName()
    },(err)=>{console.log(err)},()=>{})
  }
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
      for(var i=0;i<this.all_Bid_schedule_list.length;i++){
        if(this.all_Bid_schedule_list[i].bidschename===this.bid_schedule_name){
          this.currentBidScheduleData=this.all_Bid_schedule_list[i]
          this.bidSchedule=this.all_Bid_schedule_list[i]
        }
      }
      this.getAllShiftLineSchedule()
  }
  getAllShiftLineSchedule(){
    this.shiftLinesSchedule=new Array()
    this.shiftLinesSchedule=[]
    for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
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
  current_shift_line_schedule_id
  selectShiftLineSchedule(shiftLineScheduleData){
    this.current_shift_line_schedule=shiftLineScheduleData.schedulename
    this.current_shift_line_schedule_id=shiftLineScheduleData.shiftdefref
    var start =shiftLineScheduleData.bidschedulestartdate.split("-");
    var start_Date = new Date(start[0],start[1], start[2],0 ,0, 0);
    var end =shiftLineScheduleData.bidscheduleenddate.split("-");
    var end_Date = new Date(end[0],end[1], end[2],0 , 0, 0);
    this.current_shift_line_schedule_startDate=start_Date
    this.current_shift_line_schedule_endDate=end_Date


      var tempArr=[]
      tempArr=shiftLineScheduleData.schild

      this.all_selected_schedule_shift_lines=[]
      var temp
      for(var i=0;i<tempArr.length;i++){
          temp={
            "id":tempArr[i].sh_line_id,
            "sun":tempArr[i].sun,
            "mon":tempArr[i].mon,
            "tue":tempArr[i].tue,
            "wed":tempArr[i].wed,
            "thu":tempArr[i].thu,
            "fri":tempArr[i].fri,
            "sat":tempArr[i].sat,

            "frishift2":tempArr[i].frishift2,
            "monshift2":tempArr[i].monshift2,
            "satshift2":tempArr[i].satshift2,

            "shiftdurationc": tempArr[i].shiftdurationc,
            "sunshift2":tempArr[i].sunshift2,
            "thushift2": tempArr[i].thushift2,
            "tueshift2": tempArr[i].tueshift2,
            "wedshift2": tempArr[i].wedshift2,
            "pattern":tempArr[i].pattern,
            "shiftname":tempArr[i].shiftname,
            "seq_id":tempArr[i].seq_id,
            "selectedBy":''
          }
          this.all_selected_schedule_shift_lines.push(temp)
      }

      var tempArr=[],tempObj
          for(var i=0;i<this.bid_shiftline.length;i++){
            for(var j=0;j<this.all_selected_schedule_shift_lines.length;j++){

              // if(this.bidSchedule.bidschid==this.bid_shiftline[i].bidschidref&&this.bid_shiftline[i].schedulename==this.current_shift_line_schedule && this.bid_shiftline[i].pattern==this.all_selected_schedule_shift_lines[j].pattern && this.bid_shiftline[i].shiftname==(this.all_selected_schedule_shift_lines[j].shiftname+(this.all_selected_schedule_shift_lines[j].seq_id+ + +1))){
                if(this.bidSchedule.bidschid==this.bid_shiftline[i].bidschidref &&this.bid_shiftline[i].schedulename==this.current_shift_line_schedule &&Number(this.current_shift_line_schedule_id) == this.bid_shiftline[i].shiftidref && this.all_selected_schedule_shift_lines[j].id ==this.bid_shiftline[i].shiftlineidref){
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
                    "frishift2":this.all_selected_schedule_shift_lines[j].frishift2,
                    "monshift2":this.all_selected_schedule_shift_lines[j].monshift2,
                    "satshift2":this.all_selected_schedule_shift_lines[j].satshift2,

                    "shiftdurationc": this.all_selected_schedule_shift_lines[j].shiftdurationc,
                    "sunshift2":this.all_selected_schedule_shift_lines[j].sunshift2,
                    "thushift2": this.all_selected_schedule_shift_lines[j].thushift2,
                    "tueshift2":this.all_selected_schedule_shift_lines[j].tueshift2,
                    "wedshift2": this.all_selected_schedule_shift_lines[j].wedshift2,
                    "pattern":this.all_selected_schedule_shift_lines[j].pattern,
                    "shiftname":this.all_selected_schedule_shift_lines[j].shiftname,
                    "seq_id":this.all_selected_schedule_shift_lines[j].seq_id,
                    "selectedBy":this.bid_shiftline[i].initials,
                    "edit_seq_id":this.checkID(this.all_selected_schedule_shift_lines[j].seq_id,this.all_selected_schedule_shift_lines[j].shiftname,this.all_selected_schedule_shift_lines),
                    "bidstatus":this.bid_shiftline[i].bidstatus,
                    "empidref":this.bid_shiftline[i].empidref,

               }
               tempArr.push(tempObj)
              }
            }
          }
          this.all_selected_schedule_shift_lines=[]
          this.all_selected_schedule_shift_lines=tempArr

  }

 convertNineHourShiftLineIncorrectFormat(shift,shiftDuration){
        if(shiftDuration==9){
          if(shift=='X'){
            return shift
          }else{
            return shift.split('-')[0]
          }
        }else{
          return shift
        }
      }


  currentShiftLineSchedule(shiftLineScheduleData){
    this.current_shift_line_schedule=shiftLineScheduleData.schedulename
    var start =shiftLineScheduleData.bidschedulestartdate.split("-");
    var start_Date = new Date(start[0],start[1], start[2],0 ,0, 0);
    var end =shiftLineScheduleData.bidscheduleenddate.split("-");
    var end_Date = new Date(end[0],end[1], end[2],0 , 0, 0);
    this.current_shift_line_schedule_startDate=start_Date
    this.current_shift_line_schedule_endDate=end_Date

    this.scheduleService.getSaveShiftDefintionDataBasedOnScheduleName(this.current_shift_line_schedule).subscribe((res)=>{

      var tempArr=[]
      tempArr=res

      this.all_selected_schedule_shift_lines=[]
      var temp
      for(var i=0;i<tempArr.length;i++){
          temp={
            "id":tempArr[i].id,
            "sun":tempArr[i].sun,
            "mon":tempArr[i].mon,
            "tue":tempArr[i].tue,
            "wed":tempArr[i].wed,
            "thu":tempArr[i].thu,
            "fri":tempArr[i].fri,
            "sat":tempArr[i].sat,

            "frishift2":tempArr[i].frishift2,
            "monshift2":tempArr[i].monshift2,
            "satshift2":tempArr[i].satshift2,

            "shiftdurationc": tempArr[i].shiftdurationc,
            "sunshift2":tempArr[i].sunshift2,
            "thushift2": tempArr[i].thushift2,
            "tueshift2": tempArr[i].tueshift2,
            "wedshift2": tempArr[i].wedshift2,
            "pattern":tempArr[i].pattern,
            "shiftname":tempArr[i].shiftname,
            "seq_id":tempArr[i].seq_id,
            "edit_seq_id":this.checkID(tempArr[i].seq_id,tempArr[i].shiftname,tempArr),
            "selectedBy":''
          }
          this.all_selected_schedule_shift_lines.push(temp)

          }
        },(err)=>{console.log(err)},()=>{})
      }
  expand(index){
    if(this.expand_id==index){
      this.expand_id=null
    }else{
      this.expand_id=index
    }
  }
  popUpEmpId
  checkClickForPopup=false
  oldPopUpId
  oldTimePopUpId
  style
  myFunctionm(i){


    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
  myFunction(i){
    this.popUpEmpId=i
    this.checkClickForPopup=true
    var popup = document.getElementById("myPopup"+this.popUpEmpId);
    popup.style.visibility='visible'
    if(this.oldPopUpId!=undefined ){
      var oldPopup = document.getElementById("myPopup"+this.oldPopUpId);
      oldPopup.style.visibility='hidden'
    }
    this.cdref.detectChanges()
    if(i==this.oldPopUpId){
      this.oldPopUpId=undefined
    }else{
      this.oldPopUpId=this.popUpEmpId
    }



  }
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
  popupDisable(){
    if(this.oldPopUpId!=undefined && this.checkClickForPopup==false){
      var oldPopup = document.getElementById("myPopup"+this.oldPopUpId);
      if(oldPopup!=null){
        oldPopup.style.visibility='hidden'
      }
    }
    this.checkClickForPopup=false
  }
  expandlist(i){
    if(this.expand_id==i){
      return 'expand'
    }else{
      return 'default-expand'
    }
  }
  expandBox(index){
    if(this.expand_id==index){
      this.expand_id=null
    }else{
      this.expand_id=index
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

            "frishift2":tempResult[i].frishift2,
            "monshift2":tempResult[i].monshift2,
            "satshift2":tempResult[i].satshift2,

            "shiftdurationc": tempResult[i].shiftdurationc,
            "sunshift2":tempResult[i].sunshift2,
            "thushift2": tempResult[i].thushift2,
            "tueshift2": tempResult[i].tueshift2,
            "wedshift2": tempResult[i].wedshift2,
            "pattern":tempResult[i].pattern,
            "shiftname":tempResult[i].shiftname,
            "seq_id":tempResult[i].seq_id,
            "selectedBy":''
          }
          this.all_selected_schedule_shift_lines.push(temp)
      }

       tempArr=[]
       var sName=res.schedulename
       var sId=res.sh_schedule_id
       var tempObj
          for(var i=0;i<this.bid_shiftline.length;i++){
            for(var j=0;j<this.all_selected_schedule_shift_lines.length;j++){

              if(this.bid_shiftline[i].schedulename==sName && this.bid_shiftline[i].shiftidref==sId && this.bid_shiftline[i].shiftlineidref==this.all_selected_schedule_shift_lines[j].id){
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
                    "frishift2":this.all_selected_schedule_shift_lines[j].frishift2,
                    "monshift2":this.all_selected_schedule_shift_lines[j].monshift2,
                    "satshift2":this.all_selected_schedule_shift_lines[j].satshift2,

                    "shiftdurationc": this.all_selected_schedule_shift_lines[j].shiftdurationc,
                    "sunshift2":this.all_selected_schedule_shift_lines[j].sunshift2,
                    "thushift2": this.all_selected_schedule_shift_lines[j].thushift2,
                    "tueshift2":this.all_selected_schedule_shift_lines[j].tueshift2,
                    "wedshift2": this.all_selected_schedule_shift_lines[j].wedshift2,
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
  async download(){
    var tempArr2=[]
    var s
    var tempArr=[]

    for(var j=0;j<this.all_final_data.length;j++){
      tempArr=[]
      for(var i=0;i<this.allUpdatedShiftLine.length;i++){
        if(String(this.all_final_data[j].schedulename)===String(this.allUpdatedShiftLine[i].scheduleName)){
          tempArr.push(this.allUpdatedShiftLine[i])
        }
      }
      tempArr2.push(tempArr)
    }
    const workbook = new Workbook();
    var temp
    var tempMonth
    var allData=[]
    for(var k=0;k<tempArr2.length;k++){
      this.rowCount=0
      const customized_worksheet = workbook.addWorksheet(this.all_final_data[k].schedulename);
      const customizedimageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
    const customizedbase64Image = Buffer.from(customizedimageData).toString('base64');
    const logoCustomizedSchedule = workbook.addImage({
      base64: customizedbase64Image,
      extension: 'png',
    });
    customized_worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.1, row: 0.2 },ext: { width: 50, height: 50 } });
      this.shiftLineData=tempArr2[k]

      const header = ["Initials","","Shiftline No","Sun","Mon","Tue","Wed","Thu","Fri","Sat","Pattern"];
      this._chars = this.chars;
      this._nextId = [0];
      customized_worksheet.getColumn(3).width = 12;

      const defheader=customized_worksheet.getCell('A1');
      defheader.value=' Basic Watch Schedule '+ this.all_final_data[k].schedulename
      defheader.alignment={ vertical: 'middle',horizontal: 'center' ,wrapText:true  }
      defheader.font = {bold: true,  size: 22};
      customized_worksheet.mergeCells('A1:K3');
      this.rowCount=this.rowCount+ + +6
        for(var i=0;i<header.length;i++){
          temp=this.next()
          const defCompT=customized_worksheet.getCell(temp+this.rowCount);
          defCompT.value=header[i]
          defCompT.alignment={ vertical: 'middle',horizontal: 'center'   }
          defCompT.font = {bold: true};
        }


      this._chars = this.chars;
      this._nextId = [0];
      var tempValue
      for(var i=0;i<this.shiftLineData.length;i++){
        if(i>0){

          if(this.shiftLineData[i-1].shiftname!==this.shiftLineData[i].shiftname){
            this.rowCount++
          }
        }
        this.rowCount++
        this._chars = this.chars;
        this._nextId = [0];

        if(Number(this.shiftLineData[i].shiftdurationc)==9){

          allData=[this.shiftLineData[i].selectedBy,this.shiftLineData[i].shiftname+(this.checkID(Number(this.shiftLineData[i].seq_id),this.shiftLineData[i].shiftname,this.shiftLineData)+ + + 1),Number(this.shiftLineData[i].seq_id)+ + +1,this.shiftLineData[i].sun.split('-')[0],this.shiftLineData[i].mon.split('-')[0],this.shiftLineData[i].tue.split('-')[0],this.shiftLineData[i].wed.split('-')[0],this.shiftLineData[i].thu.split('-')[0],this.shiftLineData[i].fri.split('-')[0],this.shiftLineData[i].sat.split('-')[0],this.shiftLineData[i].sunshift2.split('-')[0],this.shiftLineData[i].monshift2.split('-')[0],this.shiftLineData[i].tueshift2.split('-')[0],this.shiftLineData[i].wedshift2.split('-')[0],this.shiftLineData[i].thushift2.split('-')[0],this.shiftLineData[i].frishift2.split('-')[0],this.shiftLineData[i].satshift2.split('-')[0],this.shiftLineData[i].pattern]
        }else{
          allData=[this.shiftLineData[i].selectedBy,this.shiftLineData[i].shiftname+(this.checkID(Number(this.shiftLineData[i].seq_id),this.shiftLineData[i].shiftname,this.shiftLineData)+ + + 1),Number(this.shiftLineData[i].seq_id)+ + +1,this.shiftLineData[i].sun,this.shiftLineData[i].mon,this.shiftLineData[i].tue,this.shiftLineData[i].wed,this.shiftLineData[i].thu,this.shiftLineData[i].fri,this.shiftLineData[i].sat,this.shiftLineData[i].pattern]
        }

          for(var j=0;j<allData.length;j++){
            if(Number(this.shiftLineData[i].shiftdurationc)==9){
              if(j==10){
                this._chars = this.chars;
                this._nextId = [3];
                this.rowCount++
              }
            }
            temp=this.next()
            const defCompData=customized_worksheet.getCell(temp+this.rowCount);
            if(Number(this.shiftLineData[i].shiftdurationc)==9){
              if(j==0 || j==1 || j==2){
                customized_worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ + +1));
                }
                if((j+ + +1)==allData.length){
                  customized_worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ - +1));
                }
            }
            tempValue=allData[j]

            if(tempValue=='X' || tempValue=='x'){
              defCompData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'adadad'}};
            }

            defCompData.value=tempValue
            defCompData.alignment={ vertical: 'middle', horizontal: 'center' };
            if(allData.length==(j+ + +1)){
              const idCol = customized_worksheet.getColumn(temp);
              idCol.width = 18;
            }
            if(j!=2){
              defCompData.border = {
                bottom: {style:'thin'},
                  left: {style:'thin'},
                  right: {style:'thin'},
                  top: {style:'thin'},
                };
            }
          }
      }

  }

  workbook.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Bid Shiftlines Schedule');
  })
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

  exportData(data){
    const workbook = new Workbook();
    var temp

    var tempMonth
    var allData=[]
    var defChars
    defChars=this.chars
    this.rowCount=1

    const worksheet = workbook.addWorksheet("Leave Picks by Round");
    const header = ["#","Name","Initials","Accrued Hours"];

    for(var k=0;k<data.length;k++){
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
