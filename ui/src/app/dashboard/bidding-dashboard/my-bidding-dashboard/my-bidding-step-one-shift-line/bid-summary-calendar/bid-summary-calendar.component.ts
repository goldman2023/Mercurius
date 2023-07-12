import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { MyBiddingService } from '../../my-bidding.service';

@Component({
  selector: 'app-bid-summary-calendar',
  templateUrl: './bid-summary-calendar.component.html',
  styleUrls: ['./bid-summary-calendar.component.scss'],
})
export class BidSummaryCalendarComponent implements OnInit {
  selected: Date | null;
  currentSelectedDate=null
  eventSource: any[];
  selectedDate=null
  get_leave_data
  currentSource=[]
  empSelectedShiftlineData=[]
  all_slots=[]
  tempSelectedDate
  viewTitle
  cssClassForsingleClick
  user_data
spinner=true
holiday
defaultEventSource
vacationSummary
shiftlineSummary
round_id
default_vacationSummary
currentBidScheduleId
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
    public alertCtrl: AlertController,
    private bidSer:BidScheduleService,
    private bidLeaveSer:BidVacationLeaveService,
    private bidRoundSer:SetupBidRoundService,
    private scheduleService:GeneratedScheduleService,
    private route: ActivatedRoute,
    private addNewEmp:AddNewEmployeeService,
    private setUPbidRoundSer:SetupBidRoundService,
    private headerTitleService: HeaderTitleService,
    private myBiddingSer:MyBiddingService,
    public navParams: NavParams,
    private newBidScheduleSer:CreateNewBidScheduleService,
    private fb:FormBuilder,
    public modalCtrl: ModalController,
    private bidShiftLineSer:BidShiftlinesService,
    ) {

      this.round_id=navParams.get('round_id');
      this.shiftlineSummary=navParams.get('shiftlineSummary');
      this.default_vacationSummary=navParams.get('vacationSummary');
      this.currentBidScheduleId=this.default_vacationSummary.bidschidref
    }
    empId
    empName
  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(Number(this.currentBidScheduleId)).subscribe((res)=>{
      var temp=[],tempArr=[]
      temp=res
      var empID
      if(this.user_data.role=='emp'){
        empID=this.user_data.empid
      }else{
        empID=this.default_vacationSummary.empidref
      }
      var tempArrTwo=[]
      for(var v=0;v<temp.length;v++){
         if(empID==temp[v].empidref){
          tempArr.push(temp[v])
        }
      }
      this.vacationSummary=tempArr
      this. getAllDataBasedOnScheduleName()
    },(err)=>{console.log(err),()=>{}})


  }

  bidSchedule
  getAllDataBasedOnScheduleName(){
    this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(Number(this.currentBidScheduleId)).subscribe((res)=>{
      this.bidSchedule=res
      this.all_slots=[]
      this.all_slots=this.bidSchedule.leavemap
      for(var i=0;i<this.shiftlineSummary.length;i++){
        this.getshiflineData(this.shiftlineSummary[i])
      }
    },(err)=>{console.log(err)},()=>{})
  }
  getshiflineData(bidScheduleShiftlineSchedulData){
    this.scheduleService.newGetShiftLineBasedOnShiftLineId(bidScheduleShiftlineSchedulData.shiftlineidref).subscribe((res)=>{
      var tempObj
      tempObj=res
      this.empSelectedShiftlineData.push({
        "shiftdefenddate": new Date(bidScheduleShiftlineSchedulData.endDate).getFullYear()+'-'+(new Date(bidScheduleShiftlineSchedulData.endDate).getMonth()+ + +1)+'-'+new Date(bidScheduleShiftlineSchedulData.endDate).getDate() ,
        "shiftdefref": bidScheduleShiftlineSchedulData.shiftlineidref,
        "shiftdefstartdate": new Date(bidScheduleShiftlineSchedulData.startDate).getFullYear()+'-'+(new Date(bidScheduleShiftlineSchedulData.startDate).getMonth()+ + +1)+'-'+new Date(bidScheduleShiftlineSchedulData.startDate).getDate(),
        "shiftname":  tempObj.shiftname,
        "shiftdurationc":tempObj.shiftdurationc,
        "fri": tempObj.fri,
        "mon": tempObj.mon,
        "sat": tempObj.sat,
        "sun": tempObj.sun,
        "thu": tempObj.thu,
        "tue": tempObj.tue,
        "wed": tempObj.wed,
        "frishift2": tempObj.frishift2,
        "monshift2": tempObj.monshift2,
        "satshift2": tempObj.satshift2,
        "sunshift2": tempObj.sunshift2,
        "thushift2": tempObj.thushift2,
        "tueshift2": tempObj.tueshift2,
        "wedshift2": tempObj.wedshift2,
      })
      if(this.empSelectedShiftlineData.length==this.shiftlineSummary.length){
        this.calendarMethod()
      }

    },(err)=>{console.log(err)},()=>{})

  }
  close(){
    this.modalCtrl.dismiss()
  }
  checkRDOs(date){
    var updatedDate,startDate,endDate

    updatedDate=new Date(Number(date.split('/')[0]),Number(date.split('/')[1])+ - +1,Number(date.split('/')[2]),0,0,0)
    for(var i=0;i<this.empSelectedShiftlineData.length;i++){
      startDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[2]),0,0,0)
      endDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[2]),0,0,0)
      const shiftMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      function isWithinShift(date: Date, dayShift: string, shift2: string) {
          const day = date.getDay();
          const shiftKey = shiftMap[day];
          const shiftKey2 = shiftKey + 'shift2';
          const isInShift1 = day < 7 && this.empSelectedShiftlineData[i][shiftKey] === 'X';
          const isInShift2 = day >= 7 && day < 14 && this.empSelectedShiftlineData[i][shiftKey2] === 'X';

          return isInShift1 || isInShift2;
      }

      if (startDate.getTime() <= updatedDate.getTime() && updatedDate.getTime() <= endDate.getTime()) {
          let rdo = '';
          const day = updatedDate.getDay();

          if (this.empSelectedShiftlineData[i].shiftdurationc == 9) {
              for (let d = 0; d < this.datesForNineHoursShift.length; d++) {
                  for (let day = 0; day < this.datesForNineHoursShift[d].length; day++) {
                      if (this.datesForNineHoursShift[d][day].getTime() <= updatedDate.getTime() && updatedDate.getTime() <= this.datesForNineHoursShift[d][day].getTime()) {
                          if (isWithinShift(updatedDate, shiftMap[day], shiftMap[day] + 'shift2')) {
                              rdo = 'rdo';
                          }
                      }
                  }
              }
          } else {
              if (this.empSelectedShiftlineData[i][shiftMap[day]] === 'X') {
                  rdo = 'rdo';
              }
          }

          return rdo;
      }
    }
  }
  datesForNineHoursShift=[]
  listOfMatrixForNineHours(list){
    var matrix = [], i, k,sun=[],mon=[],tue=[],wed=[],thu=[],fri=[],sat=[],matrixOne = [], j, l,h
    var tempNum=0,tempArr=[],tempArr2=[]
    const res = [];
    for (let i = 0; i < list.length; i += 14) {
        const chunk = list.slice(i, i + 14);
        res.push(chunk);
    }
    this.datesForNineHoursShift=res
  }
  checkEmpExist(emp){
    var count=0
    if(this.user_data.empid!='emp'){
      if(emp.indexOf(this.default_vacationSummary.initials) !== -1){
        return true
      }else{
        return false
      }
    }else{
      if(emp.indexOf(this.user_data.initials) !== -1){
        return true
      }else{
        return false
      }
    }
  }
  checkShiftDuration(date){
    var updatedDate,startDate,endDate
    updatedDate=date

    for(var i=0;i<this.empSelectedShiftlineData.length;i++){
      startDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefstartdate.split('-')[2]),0,0,0)
      endDate=new Date(Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[0]),Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[1])+ - +1,Number(this.empSelectedShiftlineData[i].shiftdefenddate.split('-')[2]),0,0,0)
      if(startDate.getTime()<=updatedDate.getTime() && updatedDate.getTime()<=endDate.getTime() ){
        if(this.empSelectedShiftlineData[i].shiftdurationc !=null && this.empSelectedShiftlineData[i].shiftdurationc==undefined){
          return 8
        }else{
          if (this.empSelectedShiftlineData[i].shiftdurationc == 9) {
            function findRDO(updatedDate, shiftData, dayIndex, shiftNames) {
              var rdo = 9;
              if (updatedDate.getDay() !== dayIndex) return rdo;
              for (var d = 0; d < this.datesForNineHoursShift.length; d++) {
                  for (var day = 0; day < this.datesForNineHoursShift[d].length; day++) {
                      var shiftTime = this.datesForNineHoursShift[d][day].getTime();
                      if (shiftTime <= updatedDate.getTime() && updatedDate.getTime() <= shiftTime) {
                          var shift1Name = shiftNames[0], shift2Name = shiftNames[1];
                          if (day < 7 && shiftData[shift1Name] !== 'X') {
                              rdo = Number(shiftData[shift1Name].split('-')[1]);
                          } else if (day > 6 && day < 14 && shiftData[shift2Name] !== 'X') {
                              rdo = Number(shiftData[shift2Name].split('-')[1]);
                          }
                      }
                  }
              }
              return rdo;
          }
          var daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
          for (var i = 0; i < daysOfWeek.length; i++) {
              var shiftNames = [daysOfWeek[i], daysOfWeek[i] + 'shift2'];
              var rdo = findRDO(updatedDate, this.empSelectedShiftlineData[i], i, shiftNames);
              if (rdo !== 9) return rdo;  // If rdo has been updated, return it immediately.
          }
          
          }else{
            return this.empSelectedShiftlineData[i].shiftdurationc
          }

        }
      }
    }
  }


  calendarMethod(){
    this.selectedDateEmp=[]
    this.checkSelectedDate=undefined
    var sDate=[]
    var temp=[]
    this.selectedDate
    this.eventSource=[]
    var temp1=[]
      var t,start,end
      var uniqueDate=[],defuniqueDate=[]
      for(var i=0;i<this.all_slots.length;i++){
        for(var j=0;j<12;j++){
          defuniqueDate.push(new Date(this.all_slots[i].leavestartdate.split("-")[0],j,1,0,0,0))
        }
        for(var j=0;j<12;j++){
          defuniqueDate.push(new Date(this.all_slots[i].leaveenddate.split("-")[0],j,1,0,0,0))
        }
      }
      console.log()
      for(var i=0;i<this.vacationSummary.length;i++){
        if(this.round_id==(this.vacationSummary[i].roundseq_id+ -+ 1)){
        start=this.vacationSummary[i].vacationstartdate
        end=this.vacationSummary[i].vacationenddate
        uniqueDate.push(new Date(start.split("-")[0],Number(start.split("-")[1])+ - +1,1,0,0,0))
        uniqueDate.push(new Date(end.split("-")[0],Number(end.split("-")[1])+ - +1,1,0,0,0))
        }
      }
      var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var uniqueDa = uniqueDate.map(s => s.getTime()).filter((s, i, a) => a.indexOf(s) == i).map(s => new Date(s));
    var defuniqueDa = defuniqueDate.map(s => s.getTime()).filter((s, i, a) => a.indexOf(s) == i).map(s => new Date(s));
    var tempArr=[]
    var maxDate=Math.max.apply(null,uniqueDa);
    var minDate=Math.min.apply(null,uniqueDa);
    var diffDays = Math.abs(maxDate - minDate);
    diffDays=Math.ceil(diffDays / (1000 * 60 * 60 * 24));
    var maxDate=Math.max.apply(null,defuniqueDa);
    var minDate=Math.min.apply(null,defuniqueDa);
    var defdiffDays = Math.abs(maxDate - minDate);
    defdiffDays=Math.ceil(diffDays / (1000 * 60 * 60 * 24));

    var dt,month,year,daysInMonth
    for(var i=0;i<uniqueDa.length;i++){
      month =Number(uniqueDa[i].getMonth())+ + + 1;
      year = uniqueDa[i].getFullYear();
        daysInMonth = new Date(year, month, 0).getDate();
        for(var j=0;j<daysInMonth;j++){
          tempArr.push(new Date(year,month+ - +1,j+1,0,0,0))
        }
    }
    var defTempArr=[]
    for(var i=0;i<defuniqueDa.length;i++){
      month =Number(defuniqueDa[i].getMonth())+ + + 1;
      year = defuniqueDa[i].getFullYear();
        daysInMonth = new Date(year, month, 0).getDate();
        for(var j=0;j<daysInMonth;j++){
          defTempArr.push(new Date(year,month+ - +1,j+1,0,0,0))
        }
    }
    sDate=[]
    var tempDate
    this.listOfMatrixForNineHours(defTempArr)
      for(var i=0;i<tempArr.length;i++){
        tempDate=tempArr[i].getFullYear()+'/'+(tempArr[i].getMonth()+ + +1)+'/'+tempArr[i].getDate()
          sDate.push({"startDate":tempDate,"endDate":tempDate,"title":this.checkRDOs(tempDate),"emp":[],"slot":0})
      }
      for(var d=0;d<sDate.length;d++){
        t=new Date(sDate[d].startDate)
        var emp
        emp=this.checkEmp(t)
        var dayName = days[new Date(t).getDay()];
        if(sDate[d].title=="rdo"){
              var te=t.toISOString().split('T')[0].replaceAll('-', '/');
              this.eventSource.push( {"title":sDate[d].title,"startTime":new Date(te),"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }
        else{
          var te=t.toISOString().split('T')[0].replaceAll('-', '/');
          this.eventSource.push( {"title": "","startTime":new Date(te),"endTime":new Date(te),"allDay": true,"emp":emp,"selected":false,"slot":sDate[d].slot})
        }
      }
    this.spinner=false
    this.defaultEventSource=this.eventSource
    this.listToMatrix(this.eventSource)
}
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
selectedDateEmp=[]
checkSelectedDate=undefined
selectDate(e){
  this.selectedDateEmp=[]
  this.checkSelectedDate=true
  if(e.emp.length<1){
    this.selectedDateEmp=[]
    this.checkSelectedDate=false
  }
  for(var i=0;i<e.emp.length;i++){
    this.addNewEmp.getAllEmployeeBasedOnmanagerIdEmpInitials(this.user_data.id,e.emp[i]).subscribe((res)=>{
      this.selectedDateEmp.push(res[0])
      const key = 'empid';
      this.selectedDateEmp=[...new Map(this.selectedDateEmp.map(item =>
        [item[key], item])).values()]
        this.selectedDateEmp= this.selectedDateEmp.sort((a,b)=>{ return a.rank - b.rank});
    },(err)=>{console.log(err)},()=>{})
  }

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
cssClassSingle(){
  // this.cdref.detectChanges()
  return this.cssClassForsingleClick
}
cssClassDouble(){
return 'double-click'
}
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
  convertDate(date){
    return new Date(Number(date.split('-')[0]),Number(date.split('-')[1])+ - +1,Number(date.split('-')[2]),0,0,0)
  }
  checkEmp(date){
    var tempArr=[]
    this.get_leave_data=this.vacationSummary
    for(var i=0;i<this.get_leave_data.length;i++){
      var start=new Date(Number(this.get_leave_data[i].vacationstartdate.split('-')[0]),Number(this.get_leave_data[i].vacationstartdate.split('-')[1])+ - +1,Number(this.get_leave_data[i].vacationstartdate.split('-')[2]),0,0,0)
      var end=new Date(Number(this.get_leave_data[i].vacationenddate.split('-')[0]),Number(this.get_leave_data[i].vacationenddate.split('-')[1])+ - +1,Number(this.get_leave_data[i].vacationenddate.split('-')[2]),0,0,0)
      if(start.getTime()<=new Date(date).getTime() && end.getTime()>=new Date(date).getTime()){
       tempArr.push(this.default_vacationSummary.initials)
      }
    }
    return tempArr
  }
}
