import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import Swal from 'sweetalert2';
import straightlines_io_apis from 'src/app/json/apis.json';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-save-new-bid-schedule',
  templateUrl: './save-new-bid-schedule.component.html',
  styleUrls: ['./save-new-bid-schedule.component.scss'],
})
export class SaveNewBidScheduleComponent implements OnInit {
all_slots=[]
  scheduleNameForm: FormGroup;
  select_shiftline_schedule=['Trimester1_Shiftline Schedule','Trimester2_Shiftline Schedule','Trimester3_Shiftline Schedule']
  saveSchedule=[];
  all_Schedule: any;
  updateScheduleId: any;
  schedule__name: any;
  allShiftData=[]
  user_data: any;
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
  shiftlineTableArray=[]
  roundStartTime: any;
  roundStartDate: Date;
  currentBidRoundData: any[];
  allScheduleData: any[];
  allEmpForBidding: any[];
  roundEndTime: any;
  finalViewBidWindowData: any[];
  interval: any;
  distance: any;
  seconds: any;
  minutes: any;
  oldPopUpId: any;
  timePopUpId: any;
  oldTimePopUpId: any;
  currentPopupId: any;
  all_Bid_schedule_list=[]
  checkClickForPopup=false;
  currentBidScheduleData
  defaultMAxLeave: number;
  maxLeave: number;
  totalBidRounds: number;
  allRoundInfo: any[];
  totalEmp=0;
  totalDefaultEmp: any;
  all_bid_round_data: any[];
  all_window_data=[]
  allEmployee=[]
  shiftLinesSchedule: any[];
  all_final_data_for_total_emp: any[];
  bidSchedule: any;
  shiftlineScheduleData: any;
  all_Employee=[]
  newBidScheduleId=0
  checkShiftLine
  list_all_emp_for_bid=[]
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private headerTitleService: HeaderTitleService,
    private bidShiftLineSer:BidShiftlinesService,
    private scheduleService:GeneratedScheduleService,
    private bidScheduleSer:CreateNewBidScheduleService,
    private getAllEmp:AddNewEmployeeService,
    private bidWindowSer:BidWindowService,
    private emaliNotificationsSer:EmailNotificationsService,
    private localData: LocalDataService,
    private fb:FormBuilder) {
      this.saveSchedule=navParams.get('saveSchedule')
      this.checkShiftLine=navParams.get('checkShiftLine')
      this.saveDuplicateSchedule=navParams.get('schedule')

   }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.scheduleNameForm = this.fb.group({
     schedule_name:new FormControl(this.schedule__name,Validators.compose([Validators.required,this.noSpecialCharsValidator])),
    })
    this.getAllEmployee()
  }
  noSpecialCharsValidator(control: AbstractControl): { [key: string]: any } | null {
    const pattern = /^[a-zA-Z0-9 ]*$/; // Regular expression to allow only alphanumeric characters and spaces
    if (!pattern.test(control.value)) {
      return { 'specialChars': true };
    }
    return null;
  }
  get schedule_name(){
    return this.scheduleNameForm.get('schedule_name')
  }
  getAllEmployee(){
    var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
    for(var i=0;i<tempObj.employeemap.length;i++){
      this.getAllEmp.getEmpDataBasedOnEmpId(tempObj.employeemap[i]).subscribe(
        (res)=>{
          this.all_Employee.push(res)
          this.all_Employee=this.all_Employee.sort((a, b) => a.rank - b.rank)

      },
        (err)=>{console.log(err)},()=>{})
    }
  }
  scheduleShiftLine(){
    this.scheduleNameUnique=true
  }
  submit(){
    var tempObj=JSON.parse(this.localData.getItem('newBidSchedule'))
    if(tempObj!=null){
    var finalArrShiftLineSchedule=[],finalArrVacationLeave=[],finalArrBidRound=[],finalArrEmp=[]
    for(var i=0;i<tempObj.employeemap.length;i++){
      finalArrEmp.push(
        {
          "empidref":tempObj.employeemap[i]
        }
      )
    }
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
    if(tempObj.shiftdefmap.length>0 && finalArrEmp.length>0){
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
    //   if(this.checkShiftLine==true){
    //     scheduleStatus=0
    //   }else{
    //     scheduleStatus=scheduleStatus
    //   }
    // }
    var tempArr=[]
    for (var i = 0; i < tempObj.roundmap.length; i++) {
      tempArr.push({
        bidroundid: '',
        bidschref: '',
        timezone: tempObj.timezone,
        weekendstatus: checkExcludeWeekend,
        roundstarttime: tempObj.roundmap[i].roundstarttime,
        roundendttime: tempObj.roundmap[i].roundendttime,
        roundduration: tempObj.roundmap[i].roundduration,
        roundstartdate: tempObj.roundmap[i].roundstartdate,
        roundenddate: tempObj.roundmap[i].roundenddate,
        bidleavereason: tempObj.roundmap[i].bidleavereason,
        roundseq_id: i + +(+1),
      });
    }

    var finalObj = {
      bidschename: this.scheduleNameForm.value.schedule_name,
      bidmanagerid: this.user_data.id,
      timezone: tempObj.timezone,
      intervalstarttime: tempObj.intervalstarttime,
      intervalduration: tempObj.intervalduration,
      hasinterval: tempObj.hasinterval,
      bidroundoption: tempObj.bidroundoption,
      weekendstatus: checkExcludeWeekend,
      bidschstartdate: bidScheduleStartDate,
      bidschenddate: bidScheduleEndDate,
      schedulesavestatus: scheduleStatus,
      leavesavestatus: leaveStatus,
      roundsavestatus: roundStatus,
      totalbidleaves: total_leave,
      totalbidrounds: total_round,
      shiftdefmap: tempObj.shiftdefmap,
      employeemap: finalArrEmp,
      leavemap: tempObj.leavemap,
      roundmap: tempObj.roundmap,
      status: 'Bidding Scheduled',
      summaryemail: 'Incomplete',
    };

tempArr=[]
//
    var temp=this.scheduleNameForm.value.schedule_name
    this.bidScheduleSer.checkBidScheduleName(temp,this.user_data.id).subscribe((res)=>{
    var message=res['message']
    if(res['message']=='duplicate bidschedule name'){
      this.scheduleNameUnique=false
    }
    else {
      this.scheduleNameUnique=true


      // this.bidVacationSlot()

      this.bidScheduleSer.createNewBidSchedule(finalObj).subscribe((res)=>{

        var temp
        temp=res
        this.newBidScheduleId=res['bidschid']
        this.bidShiftLineTable(finalObj,finalObj.roundmap)

        this.bidVacationSlot(temp.leavemap)

                Swal.fire({
              title: 'Success!',
              html: 'Your bid schedule is saved!',
              icon: 'success',
              showCancelButton: false,
              imageHeight:'250px',
              heightAuto:false,
              confirmButtonColor:'#ff6700',
            }).then((result) => {
              this.localData.removeItem('newBidSchedule')
              this.localData.removeItem('roundsChangeData')
              this.navCtrl.navigateBack(straightlines_io_apis.apis.manage_bid_schedule)
            })
                  },(error)=>{
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
      },(error)=>{
        console.log(error)
      },()=>{
      })
              }

  }





  allBidWindoRoundData(){
    var totalEmp=this.all_Employee.length
    var tempObj,tempArr=[]
    var count=0

    for(var j=0;j<this.all_bid_WindoRound_data.length;j++){
      // tempArr=[]
        for(var i=0;i<this.all_bid_WindoRound_data[j].RoundData.length;i++){
          count++
          if(i<totalEmp){
            tempObj={
              "initials":this.all_Employee[i].initials,
              "rank": this.all_Employee[i].rank,
              "trans_seq_id":count,
              "bidschidref":this.newBidScheduleId,
              "empidref":this.all_Employee[i].empid,
              "roundseq_id": this.all_bid_WindoRound_data[j].Round,
              "bidschename":this.scheduleNameForm.value.schedule_name,
              "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
              "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
              "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
              "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
              "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
              "shiftlinebidstatus": "Eligible",
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
              "bidschidref":this.newBidScheduleId,
              "empidref":'',
              "trans_seq_id":count,
              "roundseq_id": this.all_bid_WindoRound_data[j].Round,
              "bidschename":this.scheduleNameForm.value.schedule_name,
              "bidstartdate":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate),
              "bidenddate": this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
              "bidstarttime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
              "bidendtime": this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate),
              "empbidduration":"00:"+this.all_bid_WindoRound_data[j].RoundData[i].bid_duration+':00',
              "shiftlinebidstatus": "Eligible",
              "vacationbidstatus":"Eligible",
              "fname": '',
              "lname":'',
              "empseq_id": i+ + +1,
              "empbid_start_time":this.formatDate( this.all_bid_WindoRound_data[j].RoundData[i].startDate) +' ' + this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].startDate),
              "empbid_end_time":this.formatDate(this.all_bid_WindoRound_data[j].RoundData[i].endDate)+ ' '+this.convertTime(this.all_bid_WindoRound_data[j].RoundData[i].endDate)
            }
          }
          tempArr.push(tempObj)
        }

    }


    this.bidWindowSer.createNewBidSchedule(tempArr).subscribe((res)=>{

      this.emaliNotificationsSer.whenBidManagerCreateTheNewBidSchedule(this.newBidScheduleId).subscribe((res)=>{},(err)=>{
        console.log(err)
      },()=>{})
    },(err)=>{console.log(err)},()=>{})
  }
  bidShiftLineTable(finalObj,roundmap){
    this.shiftlineTableArray=new Array()
    var tempObj,index=0
    for(var i=0;i<finalObj.shiftdefmap.length;i++){
    this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(finalObj.shiftdefmap[i].shiftdefref).subscribe((res)=>{
      index++
      var
      result=res

      for(var k=0;k<result[0].schild.length;k++){

        tempObj={
          "bidstatus": "Eligible",
          "windowstatus": "",
          "empwindowduration": null,
          "empwindowstartdateandtime": "",
          "bidschidref":this.newBidScheduleId,
          "bidschename": this.scheduleNameForm.value.schedule_name,
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
      if(index===finalObj.shiftdefmap.length){this.finalSubmit(roundmap)}

    },(err)=>{console.log(err)},()=>{})
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
  finalSubmit(roundmap){

    this.bidShiftLineSer.saveBidShiftlinesData(this.shiftlineTableArray).subscribe((res)=>{

    this.createBidROundData(roundmap)
  },
    (err)=>{console.log(err)},()=>{})
  }
  convertTime(time) {
    time = new Date(time)
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



  close(){
    this.modalCtrl.dismiss()
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
    var d,month,day,year
    d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
checkExcludeWeekend=true
      createBidROundData(all_SBP_rounds){
        var tempArr=[]
        this.allRoundInfo=all_SBP_rounds

        var startDate,endDate,startTime,endTime,duration,leaveRule
            startDate=all_SBP_rounds[0].roundstartdate
            startTime=all_SBP_rounds[0].roundstarttime
            endTime=all_SBP_rounds[0].roundendttime
            this.totalEmp=this.all_Employee.length
            var tempArr=[]

              this.totalDefaultEmp=this.totalEmp
                var sDate,finalArr=[],remaining_mins=0
                this.totalEmp=this.totalDefaultEmp
                tempArr=[]
              var startT=startTime.split(':')
              var endT=endTime.split(':')

              var start,end,endD
                  start=this.formatDate(startDate)
                  end=this.formatDate(startDate)
                  start=start.split("-")
                  end=end.split("-")
                  var s=new Date(Number(start[0]),Number(start[1])+ - +1, start[2],Number(startT[0]), Number(startT[1]), 0)
                  endD=new Date(Number(start[0]),Number(start[1])+ - +1, start[2],Number(startT[0]), Number(startT[1]), 0)
                  var e=new Date(Number(end[0]),Number(end[1])+ - +1, end[2],Number(endT[0]), Number(endT[1]), 0)
            var tempNewArr=[],arr=[]
            this.all_window_data=[]


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

                if( j==0){
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
                    s.setMinutes( s.getMinutes() + Number(duration) );
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


                    if(s.getTime()<e.getTime() && endD.getTime()<=e.getTime()){
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
        this.allBidWindoRoundData()

      }
      checkSingleDigit(number){
        if(Number(number)<10){
          return '0'+number
        }else{
          return number
        }
      }


//Vacation
  bidVacationSlot(allSlotData){

    var tempObj={
      "bidstatus": "Eligible",
      "windowstatus": "",
      "bidschidref": this.newBidScheduleId,
      "bidschename": this.scheduleNameForm.value.schedule_name,
      "empidref": '',
      "initials": "",
      "roundseq_id": 1,
      "vcationhours": "00:30:00",
      "vacationstartdate": "",
      "vacationenddate": ""
    }
  this.all_slots=allSlotData

this.calendarMethod()
// if(this.eventSource!=undefined){
//   this.listToMatrix(this.eventSource)
// }

    }
    dateMulti: string[];
    type: 'string';
    selected: Date | null;
    currentSelectedDate=null
    cal_id: any;
    eventSource: any[];
    selectedDate=null
    viewTitle: any;
    isToday: boolean;
    leaveType: any;
    currentSelectedTwoDate: any[];
    datesToHighlight = [];
    temp: any;
    tempSelectedDate: string;
    clickName: string;
    clickCount=0;
    t: any;
    defaultEventSource
    holiday: boolean;
    selectedLeaveDates: any
    rdosInLeave=0
    alertPresented
    selectedLeaves=0
    calendar = {
      mode: 'month' as CalendarMode,
      step: 30 as Step,
      month:[

      ]
    }
    calendarMethod(){


  var sDate=[]
var temp=[]
this.selectedDate
this.eventSource=[]
var temp1=[]
    var t
    var uniqueDate=[]
    for(var i=0;i<this.all_slots.length;i++){
      for(var j=0;j<12;j++){
        uniqueDate.push(new Date(this.all_slots[i].leavestartdate.split("-")[0],j,1,0,0,0))
      }

    }
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var uniqueDa = uniqueDate.map(s => s.getTime()).filter((s, i, a) => a.indexOf(s) == i).map(s => new Date(s));
  this.calendar.month=uniqueDa
  var tempArr=[]
  var maxDate=Math.max.apply(null,uniqueDa);
  var minDate=Math.min.apply(null,uniqueDa);
  var diffDays = Math.abs(maxDate - minDate);
  diffDays=Math.ceil(diffDays / (1000 * 60 * 60 * 24));
 var dt,month,year,daysInMonth
  for(var i=0;i<uniqueDa.length;i++){
    month =Number(uniqueDa[i].getMonth())+ + + 1;
    year = uniqueDa[i].getFullYear();
      daysInMonth = new Date(year, month, 0).getDate();
      for(var j=0;j<daysInMonth;j++){
        tempArr.push(new Date(year,month+ - +1,j+1,0,0,0))
      }
  }
  sDate=[]
  for(var j=0;j<this.all_slots.length;j++){
    for(var i=0;i<tempArr.length;i++){
      var tempT= !!sDate.find(item => {
       return new Date(item.startDate).getMonth() === tempArr[i].getMonth() && new Date(item.startDate).getFullYear() === tempArr[i].getFullYear() && new Date(item.startDate).getDate() === tempArr[i].getDate()})
      var tempDate=(Number(tempArr[i].getMonth())+ + + 1)+'/'+tempArr[i].getDate()+'/'+tempArr[i].getFullYear()
      if(tempArr[i]<new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0)){
        if(tempT==false){
        sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"SS","emp":[],"slot":0})
        }
      }else if(tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) ){
              if(tempT==false){
                if( tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) && tempArr[i]<=new Date(this.all_slots[j].leaveenddate.split("-")[0],Number(this.all_slots[j].leaveenddate.split("-")[1])+ - +1,Number(this.all_slots[j].leaveenddate.split("-")[2]),0,0,0) ){
                    sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"SS","emp":[],"slot":this.all_slots[j].leaveslots})
                }
                else if(this.all_slots.length<=j+1){
                  sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"SS","emp":[],"slot":0})
                }

              }else if(tempT==true){
                  var tempA=[],slot=0
                  for(var k=0;k<sDate.length;k++){
                    if((Number(sDate[k].startDate.split("/")[0]) ===Number( tempArr[i].getMonth()+ + +1)) &&Number( sDate[k].startDate.split("/")[2]) === tempArr[i].getFullYear() && Number(sDate[k].startDate.split("/")[1] )=== tempArr[i].getDate()){
                      slot=this.all_slots[j].slots+ + +sDate[k].slot
                      tempA.push({"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":slot})
                    }else{
                      tempA.push({"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":sDate[k].slot})
                    }
                  }
                  sDate=tempA
              }
        }
    }
  }


    for(var d=0;d<sDate.length;d++){
      t=new Date(sDate[d].startDate)
      // uniqueDate.push(new Date((new Date(sDate[d].startDate).getMonth()+ + +1)+'-01-'+new Date(sDate[d].startDate).getFullYear()))
      var dayName = days[new Date(t).getDay()];
      if(sDate[d].title=="SS"){
          if(dayName=='Sun' || dayName=='Sat'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "SS","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"slot":sDate[d].slot,"selected":false})
          }
        }
        else if(sDate[d].title=="SM"){
          if(dayName=='Sun' || dayName=='Mon'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "SM","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"slot":sDate[d].slot,"selected":false})
          }
        }
        else if(sDate[d].title=="MT"){
          if(dayName=='Mon' || dayName=='Tue'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "MT","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"slot":sDate[d].slot,"selected":false})
          }
        }
        else if(sDate[d].title=="TW"){
          if(dayName=='Tue' || dayName=='Wed'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "TW","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"slot":sDate[d].slot,"selected":false})
          }
        }
        else if(sDate[d].title=="WT"){
          if(dayName=='Wed' || dayName=='Thu'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "WT","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"slot":sDate[d].slot,"selected":false})
          }
        }
        else if(sDate[d].title=="TF"){
          if(dayName=='Thu' || dayName=='Fri'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "TF","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"selected":false,"slot":sDate[d].slot})
          }
        }
        else if(sDate[d].title=="FS"){
          if(dayName=='Fri' || dayName=='Sat'){
            var te=String(t.toLocaleDateString());
            this.eventSource.push( {"title": "FS","startTime":new Date(te),"endTime":new Date(te),"emp":sDate[d].emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
          }else{
           var te=String(t.toLocaleDateString());
           this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"selected":false,"slot":sDate[d].slot})
          }
        }
      else{
        var te=String(t.toLocaleDateString());
        this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":sDate[d].emp,"selected":false,"slot":sDate[d].slot})
       }
    }



  this.defaultEventSource=this.eventSource
  this.listToMatrix(this.eventSource)
    }
    onViewTitleChanged(title) {
      this.viewTitle = title;

  }

  conditionOne(e){
    return (!(this.tempSelectedDate!=null&&e.selected!==true  && e===this.tempSelectedDate)&&e.selected!==true)
  }
  conditionTwo(e){
    return (e.selected===true)
  }
  conditionThree(e){
    return (this.tempSelectedDate!=null&&e.selected!==true  && e===this.tempSelectedDate)
  }
  conditionFour(e){
    // var arr=['09/06/2021','10/11/2021','01/11/2021']
    var arr=[]
    var i=0
    do{
      if(new Date(e.date).getDate() === new Date(arr[i]).getDate() && new Date(e.date).getMonth() === new Date(arr[i]).getMonth() && new Date(e.date).getFullYear() === new Date(arr[i]).getFullYear()){
           this.holiday= true
           return (this.holiday= true)
      }else{
        i++
      }
    }while(i<arr.length)
  }

  checkConditionTwoDoubleCLick(e){

    return e.slot-e.emp.length>0
  }
  checkHoliday(){
    // var arr=['09/06/2021','10/11/2021','01/11/2021']
    var arr=[]
  var i=0


   do{
    for(var j=0;j<this.eventSource.length;j++){
      var e={"date":this.eventSource[j].startTime}

      if(new Date(e.date).getDate() === new Date(arr[i]).getDate() && new Date(e.date).getMonth() === new Date(arr[i]).getMonth() && new Date(e.date).getFullYear() === new Date(arr[i]).getFullYear()){

    i++
    //  'bg-color'
    }else{
      i++
      // return ''
    }}
  }while(i<arr.length)

  }
cssClassDouble(){
  return 'double-click'
}

  removePopup(){
    if(this.checkClickForPopup==false){
      if(this.oldPopUpId!=undefined){
      var popupTwo = document.getElementById("myPopup"+this.oldPopUpId);
        popupTwo.style.visibility='hidden'
      }
      var popup = document.getElementById("myPopupStatus");
      popup.style.visibility='hidden'
    }
    this.checkClickForPopup=false
  }
currentSource=[]
listToMatrix(list) {
  var matrix = [], i, k,sun=[],mon=[],tue=[],wed=[],thu=[],fri=[],sat=[],matrixOne = [], j, l,h

var tempNum=0,tempArr=[],tempArr2=[]
for (j = 0;j < list.length; j++) {
  if(list[j-1]!=undefined){

    if(list[j].startTime.getMonth()==list[j-1].startTime.getMonth() ){
      tempArr.push(list[j])
      if((Number(list.length)+ - +1)===j){
        matrixOne.push(tempArr)
        tempArr=[]
      }
    }else{

      matrixOne.push(tempArr)
      tempArr=[]
      tempArr.push(list[j])
    }
}else{
  if(list[j+1]==undefined ){
    matrixOne.push(tempArr)
    tempArr=[]
  }else{
    tempArr.push(list[j])
  }

}



}
var newArr=[]
for(var a=0;a<matrixOne.length;a++){
  newArr=new Array()
  if(matrixOne[a][0].startTime.getDay()==0){
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==1){
    for(var p=0;p<1;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==2){
    for(var p=0;p<2;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==3){
    for(var p=0;p<3;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==4){
    for(var p=0;p<4;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==5){
    for(var p=0;p<5;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  if(matrixOne[a][0].startTime.getDay()==6){
    for(var p=0;p<6;p++){
      newArr.push(undefined);
    }
    for(var b=0;b<matrixOne[a].length;b++){
      newArr.push(matrixOne[a][b])
    }
  }
  matrix.push(newArr)
}

this.currentSource=matrix
  return matrix;
}



}
