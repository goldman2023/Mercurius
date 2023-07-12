import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, AlertController, ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { BidLeaveSetupService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-leave-setup.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { BidVacationLeaveService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-leave/bid-vacation-leave.service';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';
import { LocalDataService } from 'src/app/services/data/local-data.service';


@Component({
  selector: 'app-bid-schedule-action-sheet',
  templateUrl: './bid-schedule-action-sheet.component.html',
  styleUrls: ['./bid-schedule-action-sheet.component.scss'],
})
export class BidScheduleActionSheetComponent implements OnInit {
  bid_schedule_data
  all_slots=[]
  get_leave_data=[]
  all_leave_slots=[]
  allLeaveData
  rowCount=0
  checkBidShceduleInProgress=false
  _nextId
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  _chars
  fileName= 'Bid Schedule Data.xlsx';
  user_data: any
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private headerTitleService: HeaderTitleService,
    private bidSer:BidScheduleService,
    public modalCtrl: ModalController,
    private bidRoundSer:SetupBidRoundService,
    private newBidScheduleSer:CreateNewBidScheduleService,
    private setUPbidRoundSer:SetupBidRoundService,
    private formBuilder:FormBuilder,
    private bidLeaveSer:BidVacationLeaveService,
    private http : HttpClient,
    private localData: LocalDataService
  ) {
    this._chars = this.chars;
    this._nextId = [0];
    this.bid_schedule_data=navParams.get('bidSchedule_data')
  }

  ngOnInit() {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    var temp
    for(var i=0;i<33;i++){
    temp =String.fromCharCode(('A').charCodeAt(0) + i);

    }

    this.currentBidScheduleId=this.bid_schedule_data.bidschid
    this.getAllData()
    var bidSchedule=this.bid_schedule_data
    var checkBiddingIsStartedOrNot=true
    var start,end

    if (bidSchedule.bidschstartdate != undefined && bidSchedule.bidschstartdate != null) {
      let start = moment(bidSchedule.bidschstartdate, 'YYYY-MM-DD');
      if (bidSchedule.roundmap.length > 0 && bidSchedule.roundmap[0].roundstarttime != undefined && bidSchedule.roundmap[0].roundstarttime != null) {
        const [hours, minutes] = bidSchedule.roundmap[0].roundstarttime.split(':');
        start.set({ hour: hours, minute: minutes, second: 0 });
      }
      const after24Hours = moment().add(24, 'hours');
      this.checkBidShceduleInProgress = !start.isAfter(after24Hours);
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
  close(){
    this.modalCtrl.dismiss()
  }
  view(bid_schedule_data){
    this.modalCtrl.dismiss()
    this.navCtrl.navigateForward(straightlines_io_apis.apis.view_bidschedule+bid_schedule_data.bidschid);
    this.localData.setItem('viewBidSchedule',JSON.stringify(bid_schedule_data))
  }
  async edit(bid_schedule_data){

    this.modalCtrl.dismiss()

  const confirm = await this.alertCtrl.create({
    header: 'Coming Soon...',
    message: 'This featrue is coming soon!!',
    cssClass: 'my-custom-class',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      }]
    })
      // await confirm.present();

    this.localData.setItem('editBidSchedule',JSON.stringify(bid_schedule_data))
    this.navCtrl.navigateForward(straightlines_io_apis.apis.edit_bidschedule+bid_schedule_data.bidschid)
  }

  convertDate(date){
    return new Date(Number(date.split('-')[0]),Number(date.split('-')[1])+ - +1,Number(date.split('-')[2]),0,0,0)
  }
  checkEmp(date){

    var tempArr=[]
    for(var i=0;i<this.get_leave_data.length;i++){

      if(this.convertDate(this.get_leave_data[i].vacationstartdate)<=date && this.convertDate(this.get_leave_data[i].vacationenddate)>=date){
       tempArr.push(this.get_leave_data[i].initials)

      }
    }
    return tempArr
  }

  async deleteBidScheduleFromList(bidScheduleData){
    var bidSchedule=bidScheduleData

    if(this.checkBidShceduleInProgress==true){
    var bidScheduleData=bidSchedule.bidschid
  var checkShiftLineSchedule= JSON.parse(this.localData.getItem('myBiddingData'))
  var bidschedulecheck=false
  if(checkShiftLineSchedule!=null){
    if(this.bid_schedule_data.bidschename==checkShiftLineSchedule.bid_schedule_name.bid_schedule_name || this.bid_schedule_data.bidschid==checkShiftLineSchedule.currentBidScheduleId){
      bidschedulecheck=true
      this.localData.removeItem('myBiddingData')
    }
  }
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to delete the record?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Delete',
          role: 'delete',
          handler: () => {
            this.newBidScheduleSer.deleteAllDataBasedOnBidScheduleId(bidScheduleData).subscribe(async (res)=>{
              const confirmSuccess = await this.alertCtrl.create({
                header: 'Success',
                message: 'Bid Schedule ('+bidSchedule.bidschename+') deleted Successfully!',
                buttons: [
                  {
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {

                    }
                  }
                  ]
                  })
                  await confirmSuccess.present();
            },(err)=>{console.log(err)},()=>{

              this.modalCtrl.dismiss('delete')
            })
        }
        }]
      })
        await confirm.present();
    }else{
      var bidSchedule=this.bid_schedule_data
      var checkBiddingIsStartedOrNot=true
      console.log(bidSchedule)
      var start,end
      if(bidSchedule.bidschenddate!=undefined && bidSchedule.bidschenddate!=null){
        if(bidSchedule.roundmap.length>0){
          if(bidSchedule.roundmap[0].roundendttime!=undefined && bidSchedule.roundmap[0].roundendttime!=null){
            end=new Date(Number(bidSchedule.bidschenddate.split('-')[0]),Number(bidSchedule.bidschenddate.split('-')[1])+ - +1,Number(bidSchedule.bidschenddate.split('-')[2]),Number(bidSchedule.roundmap[0].roundendttime.split(':')[0]),Number(bidSchedule.roundmap[0].roundendttime.split(':')[1]),0)
          }else{
            end=new Date(Number(bidSchedule.bidschenddate.split('-')[0]),Number(bidSchedule.bidschstartdate.split('-')[1])+ - +1,Number(bidSchedule.bidschenddate.split('-')[2]),0,0,0)
          }
        }else{
          end=new Date(Number(bidSchedule.bidschenddate.split('-')[0]),Number(bidSchedule.bidschenddate.split('-')[1])+ - +1,Number(bidSchedule.bidschenddate.split('-')[2]),0,0,0)
        }
      }
      var message
      if(end.getTime()<new Date().getTime()){
        message="Bid Schedule ("+this.bid_schedule_data.bidschename+") is completed. Please contact system administrator for more details. "
      }else{
        message="Bid Schedule ("+this.bid_schedule_data.bidschename+") cannot be deleted because it's in progress."
      }
      const confirm = await this.alertCtrl.create({
        header: 'Alert',
        message: message,
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          }]
        })
          await confirm.present();
    }

  }



  currentBidScheduleId

  getAllData(){

    this.bidLeaveSer.getBidVacationDataBasedOnBidScheduleId(this.currentBidScheduleId).subscribe((res)=>{

      this.get_leave_data=[]
      this.get_leave_data=res

    },(err)=>{console.log(err)},()=>{})

  }


  eventSource=[]
  export(bid_schedule_data){
    this.all_slots=[]
    this.all_slots=this.bid_schedule_data.leavemap
    // for(var i=0;i<this.bid_schedule_data.leavemap.length;i++)
    var sDate=[]
    var temp=[]

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
        sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"","emp":[],"slot":0})
        }
      }else if(tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) ){
              if(tempT==false){
                if( tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) && tempArr[i]<=new Date(this.all_slots[j].leaveenddate.split("-")[0],Number(this.all_slots[j].leaveenddate.split("-")[1])+ - +1,Number(this.all_slots[j].leaveenddate.split("-")[2]),0,0,0) ){
                    sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"","emp":[],"slot":this.all_slots[j].leaveslots})
                }
                else if(this.all_slots.length<=j+1){
                  sDate.push({"startDate":tempDate,"endDate":tempDate,"title":"","emp":[],"slot":0})
                }

              }else if(tempT==true){
                  var tempA=[],slot=0
                  for(var k=0;k<sDate.length;k++){
                    if((Number(sDate[k].startDate.split("/")[0]) ===Number( tempArr[i].getMonth()+ + +1)) &&Number( sDate[k].startDate.split("/")[2]) === tempArr[i].getFullYear() && Number(sDate[k].startDate.split("/")[1] )=== tempArr[i].getDate()){
                      if(tempArr[i]>=new Date(this.all_slots[j].leavestartdate.split("-")[0],Number(this.all_slots[j].leavestartdate.split("-")[1])+ - +1,Number(this.all_slots[j].leavestartdate.split("-")[2]),0,0,0) && tempArr[i]<=new Date(this.all_slots[j].leaveenddate.split("-")[0],Number(this.all_slots[j].leaveenddate.split("-")[1])+ - +1,Number(this.all_slots[j].leaveenddate.split("-")[2]),0,0,0) ){
                        slot=this.all_slots[j].leaveslots+ + +sDate[k].slot
                        tempA.push({"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":slot})
                        }else{
                          tempA.push({"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":sDate[k].slot})
                        }

                    }else{
                      tempA.push({"startDate":sDate[k].startDate,"endDate":sDate[k].startDate,"title":sDate[k].title,"emp":sDate[k].emp,"slot":sDate[k].slot})
                    }
                  }
                  sDate=tempA
              }
        }
    }
  }   for(var d=0;d<sDate.length;d++){
    t=new Date(sDate[d].startDate)
    var emp
    emp=this.checkEmp(t)
    // uniqueDate.push(new Date((new Date(sDate[d].startDate).getMonth()+ + +1)+'-01-'+new Date(sDate[d].startDate).getFullYear()))
    var dayName = days[new Date(t).getDay()];
    if(sDate[d].title=="SS"){
        if(dayName=='Sun' || dayName=='Sat'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "SS","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":sDate[d].startDate,"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
        }
      }
      else if(sDate[d].title=="SM"){
        if(dayName=='Sun' || dayName=='Mon'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "SM","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
        }
      }
      else if(sDate[d].title=="MT"){
        if(dayName=='Mon' || dayName=='Tue'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "MT","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
        }
      }
      else if(sDate[d].title=="TW"){
        if(dayName=='Tue' || dayName=='Wed'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "TW","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
        }
      }
      else if(sDate[d].title=="WT"){
        if(dayName=='Wed' || dayName=='Thu'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "WT","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"slot":sDate[d].slot,"selected":false})
        }
      }
      else if(sDate[d].title=="TF"){
        if(dayName=='Thu' || dayName=='Fri'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "TF","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"selected":false,"slot":sDate[d].slot})
        }
      }
      else if(sDate[d].title=="FS"){
        if(dayName=='Fri' || dayName=='Sat'){
          var te=String(t.toLocaleDateString());
          this.eventSource.push( {"title": "FS","startDate":sDate[d].startDate,"endTime":new Date(te),"emp":emp,"allDay": true,"slot":sDate[d].slot,"selected":false})
        }else{
         var te=String(t.toLocaleDateString());
         this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"selected":false,"slot":sDate[d].slot})
        }
      }
    else{
      var te=String(t.toLocaleDateString());
      this.eventSource.push( {"title": "","startDate":sDate[d].startDate,"endTime":new Date(te),"allDay": true,"emp":emp,"selected":false,"slot":sDate[d].slot})
     }
  }
      this.allLeaveData=[]

      var tempAr=[]
      this.all_leave_slots=[]
for(var i=0;i<this.eventSource.length;i++){

    if(i==0){
      tempAr.push(this.eventSource[i])
    }else{
      if(this.eventSource[i-1].startDate.split('/')[0]==this.eventSource[i].startDate.split('/')[0] && this.eventSource[i-1].startDate.split('/')[2]==this.eventSource[i].startDate.split('/')[2]){
        tempAr.push(this.eventSource[i])
      // }else if(Number(sDate[i-1].startDate.split('/')[0])<Number(sDate[i].startDate.split('/')[0]) && sDate[i-1].startDate.split('/')[2]==sDate[i].startDate.split('/')[2]){
      //   tempAr.push(sDate[i])

      }
      else{


        this.all_leave_slots.push(tempAr)
        tempAr=[]
        tempAr.push(this.eventSource[i])
      }
    }
    if((i + + +1)==sDate.length){

    this.all_leave_slots.push(tempAr)
    }

  // }
}

this.allLeaveData=this.eventSource


      this.eSheet()
  }


  async eSheet(){
    const workbook = new Workbook();


    //Customized Schedule


this.rowCount = 5
var temp
    const customized_worksheet = workbook.addWorksheet('Bid Schedule Data');
    const customizedimageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
        const customizedbase64Image = Buffer.from(customizedimageData).toString('base64');
        const logoCustomizedSchedule = workbook.addImage({
          base64: customizedbase64Image,
          extension: 'png',
        });
    customized_worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.2, row: 0.2 },ext: { width: 55, height: 50 } });
    const defheader=customized_worksheet.getCell('A1');
      defheader.value=' Bid Schedule : ' + this.bid_schedule_data.bidschename;
      defheader.alignment={ vertical: 'middle',horizontal: 'center' ,wrapText:true  }
      defheader.font = {bold: true,  size: 22};
      customized_worksheet.mergeCells('A1:AB3')
    var tempMonth
    for(var k=0;k<this.all_leave_slots.length;k++){
      this.allLeaveData=this.all_leave_slots[k]
      const header = [];
      for(var i=0;i<18;i++){
         tempMonth=new Date(Number( this.allLeaveData[0].startDate.split('/')[2]),Number(this.allLeaveData[0].startDate.split('/')[0])+-  +1,Number(this.allLeaveData[0].startDate.split('/')[1]),0,0,0).toLocaleString('en-us', { month: 'short' })
        header.push(tempMonth.toUpperCase())
        header.push('')
      }
    // const customized_headerRow = customized_worksheet.addRow(header);
    // customized_headerRow.eachCell((F6, number) => {
    // });
    this._chars = this.chars;
    this._nextId = [0];
    this.rowCount++
    for(var i=0;i<header.length;i++){
      temp=this.next()

      const defCompT=customized_worksheet.getCell(temp+this.rowCount);
      defCompT.value=header[i]
      defCompT.alignment={ vertical: 'middle',horizontal: 'center'   }
      defCompT.font = {bold: true};
    }
    this.rowCount++
    this._chars = this.chars;
    this._nextId = [1];
    var tempValue
    this.rowCount++
    for(var i=0;i<this.allLeaveData.length;i++){
      temp=this.next()
      const defCompTitle=customized_worksheet.getCell(temp+this.rowCount);
       tempValue=String(this.allLeaveData[i].startDate.split('/')[1])
      defCompTitle.value=tempValue
      defCompTitle.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
      defCompTitle.alignment={ vertical: 'middle', horizontal: 'center' };
      defCompTitle.border = {
        top: {style:'medium'},
          left: {style:'medium'},
          right: {style:'medium'},
        };
        defCompTitle.font = {bold: true};

      }

      this._chars = this.chars;
      this._nextId = [1];
      this.rowCount++
      for(var i=0;i<this.allLeaveData.length;i++){
        temp=this.next()
        const defCompDay=customized_worksheet.getCell(temp+this.rowCount);
         tempValue=new Date(Number(this.allLeaveData[i].startDate.split('/')[2]),Number(this.allLeaveData[i].startDate.split('/')[0])+ - +1,Number(this.allLeaveData[i].startDate.split('/')[1]),0,0,0).getDay()
         if(tempValue==0){
          defCompDay.value='S'
         }
         else if(tempValue==1){
          defCompDay.value='M'
         }
         else if(tempValue==2){
          defCompDay.value='T'
         }
         else if(tempValue==3){
          defCompDay.value='W'
         }
         else if(tempValue==4){
          defCompDay.value='TH'
         }
         else if(tempValue==5){
          defCompDay.value='F'
         }
         else if(tempValue==6){
          defCompDay.value='S'
         }
         defCompDay.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
         defCompDay.alignment={ vertical: 'middle', horizontal: 'center' };
         defCompDay.border = {
          bottom: {style:'medium'},
            left: {style:'medium'},
            right: {style:'medium'},
          };
          defCompDay.font = {bold: true};
        }
        var RDOS=['SS','SM','MT','TW','WT','TF','FS']
        for(var i=0;i<RDOS.length;i++){
          const defCompRDOS=customized_worksheet.getCell('A'+(this.rowCount+ + +i));
          defCompRDOS.value=RDOS[i]
          defCompRDOS.alignment={ vertical: 'middle', horizontal: 'center' };
          defCompRDOS.font = {bold: true};
        }

        this._chars = this.chars;
        this._nextId = [1];
        this.rowCount++
        for(var j=0;j<7;j++){
          this._chars = this.chars;
          this._nextId = [1];

          for(var i=0;i<this.allLeaveData.length;i++){
            temp=this.next()
            const defCompDayRDO=customized_worksheet.getCell(temp+(this.rowCount+ + +j));

            tempValue=new Date(Number(this.allLeaveData[i].startDate.split('/')[2]),Number(this.allLeaveData[i].startDate.split('/')[0])+ - +1,Number(this.allLeaveData[i].startDate.split('/')[1]),0,0,0).getDay()
            if(tempValue==0   && (j==0 || j==1)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==1  && (j==1 || j==2)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==2  && (j==2 || j==3)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==3  && (j==3 || j==4)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==4  && (j==4 || j==5)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==5  && (j==5 || j==6)){
              defCompDayRDO.value='X'
            }
            else if(tempValue==6 && (j==0 || j==6)){
              defCompDayRDO.value='X'
            }
            defCompDayRDO.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
            defCompDayRDO.alignment={ vertical: 'middle', horizontal: 'center' };
            defCompDayRDO.border = {
                left: {style:'medium'},
                right: {style:'medium'},
              };
              defCompDayRDO.font = {bold: true};
              if(j==6){
                defCompDayRDO.border = {
                  left: {style:'medium'},
                  right: {style:'medium'},
                  bottom:{style:'medium'}
                };

              }
            }
            temp=this.next()
            const defCompRDOS=customized_worksheet.getCell(temp+(this.rowCount+ + +j));
            defCompRDOS.value=RDOS[j]
            defCompRDOS.alignment={ vertical: 'middle', horizontal: 'center' };
            defCompRDOS.font = {bold: true};
        }
        this._chars = this.chars;
        this._nextId = [1];
        var tempValue
        this.rowCount=this.rowCount+ + +7
        for(var i=0;i<this.allLeaveData.length;i++){
          temp=this.next()
        this.rowCount
          const defCompTitle=customized_worksheet.getCell(temp+this.rowCount);
           tempValue=String(this.allLeaveData[i].startDate.split('/')[1])
          defCompTitle.value=tempValue
          defCompTitle.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
          defCompTitle.alignment={ vertical: 'middle', horizontal: 'center' };
          defCompTitle.border = {
            top: {style:'medium'},
              left: {style:'medium'},
              right: {style:'medium'},
            };
            defCompTitle.font = {bold: true};

          }

          this._chars = this.chars;
          this._nextId = [1];
          this.rowCount++
          for(var i=0;i<this.allLeaveData.length;i++){
            temp=this.next()
            const defCompDay=customized_worksheet.getCell(temp+this.rowCount);
             tempValue=new Date(Number(this.allLeaveData[i].startDate.split('/')[2]),Number(this.allLeaveData[i].startDate.split('/')[0])+ - +1,Number(this.allLeaveData[i].startDate.split('/')[1]),0,0,0).getDay()
             if(tempValue==0){
              defCompDay.value='S'
             }
             else if(tempValue==1){
              defCompDay.value='M'
             }
             else if(tempValue==2){
              defCompDay.value='T'
             }
             else if(tempValue==3){
              defCompDay.value='W'
             }
             else if(tempValue==4){
              defCompDay.value='TH'
             }
             else if(tempValue==5){
              defCompDay.value='F'
             }
             else if(tempValue==6){
              defCompDay.value='S'
             }
             defCompDay.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
             defCompDay.alignment={ vertical: 'middle', horizontal: 'center' };
             defCompDay.border = {
              bottom: {style:'medium'},
                left: {style:'medium'},
                right: {style:'medium'},
              };
              defCompDay.font = {bold: true};
            }


          var maxSlot=0,maxSlotArr=[]
            for(var  j=0;j<this.allLeaveData.length;j++){
              if(maxSlot>=this.allLeaveData[j].slot){
                maxSlot=maxSlot
              }else{
                maxSlot=this.allLeaveData[j].slot
              }
            }
            // maxSlot=4
            this.rowCount++
            for(var i=0;i<this.allLeaveData.length;i++){
              for(var j=0;j<maxSlot;j++){

              const defCompSlotNumber=customized_worksheet.getCell('A'+(this.rowCount + + +j));
              defCompSlotNumber.value=j + + +1
              defCompSlotNumber.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
              defCompSlotNumber.alignment={ vertical: 'middle', horizontal: 'center' };
              defCompSlotNumber.border = {
               bottom: {style:'medium'},
                 left: {style:'medium'},
                 right: {style:'medium'},
                 top: {style:'medium'},
               };
               defCompSlotNumber.font = {bold: true};
            }
            }
            this._chars = this.chars;
            this._nextId = [1];
            for(var i=0;i<this.allLeaveData.length;i++){
              temp=this.next()
              var s
              s=this.allLeaveData[i].slot
              // if(i==4){
              //   s=4
              // }
              for(var j=0;j<maxSlot;j++){


                const defCompSlot=customized_worksheet.getCell(temp+(this.rowCount + + +j));
                defCompSlot.font = {bold: true};
                if(j<maxSlot && j<s){

                  defCompSlot.value=this.allLeaveData[i].emp[j]
                  defCompSlot.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'95B3D7'}};
                  defCompSlot.alignment={ vertical: 'middle', horizontal: 'center' };
                  defCompSlot.border = {
                    bottom: {style:'medium'},
                      left: {style:'medium'},
                      right: {style:'medium'},
                    };
              }else{
                  defCompSlot.value=''
                  defCompSlot.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'000000'}};
                  defCompSlot.alignment={ vertical: 'middle', horizontal: 'center' };
                  defCompSlot.border = {
                    bottom: {style:'medium'},
                      left: {style:'medium'},
                      right: {style:'medium'},
                    };
              }

              }
              if((i+ + +1)==this.allLeaveData.length){
                temp=this.next()
                for(var j=0;j<maxSlot;j++){
              const defCompSlotNumber=customized_worksheet.getCell(temp+(this.rowCount + + +j));
              defCompSlotNumber.value=j + + +1
              defCompSlotNumber.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'C2D69B'}};
              defCompSlotNumber.alignment={ vertical: 'middle', horizontal: 'center' };
              defCompSlotNumber.border = {
               bottom: {style:'medium'},
                 left: {style:'medium'},
                 right: {style:'medium'},
                 top: {style:'medium'},
               };
               defCompSlotNumber.font = {bold: true};
              }
            }
            }
            this.rowCount=this.rowCount+ + +maxSlot
            this.rowCount=this.rowCount+ + +2
            this._chars = this.chars;
            this._nextId = [0];
            for(var i=0;i<header.length;i++){
              temp=this.next()

              const defCompT=customized_worksheet.getCell(temp+this.rowCount);
              defCompT.value=header[i]
              defCompT.alignment={ vertical: 'middle',horizontal: 'center'   }
              defCompT.font = {bold: true};
            }
            this.rowCount=this.rowCount+ + +2
            this._chars = this.chars;
            this._nextId = [0];
            for(var i=0;i<header.length;i++){
              temp=this.next()

              const defCompT=customized_worksheet.getCell(temp+this.rowCount);
              defCompT.border={bottom:{style:'thick'}}
            }

            this.rowCount=this.rowCount+ + +2
          }
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob,  this.fileName);
    })
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
