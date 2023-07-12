import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, IonSlides, NavController } from '@ionic/angular';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';

import { ActivatedRoute, NavigationExtras } from '@angular/router';
import straightlines_io_apis from 'src/app/json/apis.json';
import workloadData from 'src/app/json/work-load-data.json';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { BidWindowService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-window.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { GeneratedScheduleService } from 'src/app/services/schedule/generated-schedule.service';
import { WorkLoadService } from 'src/app/services/work-load.service';
import { MyBiddingService } from '../my-bidding.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-select-shift-line-for-bidding',
  templateUrl: './select-shift-line-for-bidding.component.html',
  styleUrls: ['./select-shift-line-for-bidding.component.scss'],
})
export class SelectShiftLineForBiddingComponent implements OnInit {
  myAnimateClass='myAnimateClass'
  @Output() passBidScheduleName: EventEmitter<any> = new EventEmitter<any>();@Output() passroundId: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  myAnimateClassButton='myAnimateClassButton'
  all_shift_lines=[]
  customPopoverOptions: any = {
   cssClass:'custom-popover'
  };
  checkShiftLineScheduleId=0
  slideOption={
    shortSwipes:true,
    longSwipes:true,
    longSwipesRatio:0.5,
    initialSlide: 0,
    slidesPerView: 5,
    spaceBetween: 0,
    duration:100,
    effect:'coverflow',
    direction:'vertical',
    centeredSlides:false,
    zoom:false
   }
  bid_schedule=[]
  bid_scheduleName=[]
  selectedShiftLines=[]
  years=[]
  all_employee=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R']
  selectShiftLineForm
  schedule_id: number=0;
  bidShculeTimeZone='US/Eastern'
  step_form_name
  empName
  empId
checkAllShiftLineSelected=false
  currentactiveRoundNumber=0
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
  empSelectedShiftLine=undefined
  allScheduleData: any[];
  all_final_data= new Array();
  current_shift_line_schedule: any;
  current_shift_line_schedule_startDate: any;
  current_shift_line_schedule_endDate: any;
  all_selected_schedule_shift_lines: any[];
  expand_id: any;
  allBidRoundData=[]
  bid_schedule_name
  user_data
  bidSchedule
  allShiftLineSchedule=[]
  shiftLinesSchedule=[]
  bid_shiftline=[]
  expand_shiftid: any;
  finalSelectedShiftLines=[]
  currentEmpData
  shiftlineScheduleData: any;
  bid_schedule_id
  round_id
  disableShiftlineSchedule=[]
  managerid
  default_work_load_data=workloadData
  totalShiftlineScheduleLength=0
    constructor(
      public navCtrl: NavController,
      public formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      private bidService:BidScheduleService,
      private headerTitleService: HeaderTitleService,
      private setUPbidRoundSer:SetupBidRoundService,
      private myBiddingSer:MyBiddingService,
      private bidShiftLineSer:BidShiftlinesService,
      private fb:FormBuilder,
      public alertController: AlertController,
      private cd: ChangeDetectorRef,
      private route: ActivatedRoute,
      private widnowTranSer:BidWindowService,
      private newBidScheduleSer:CreateNewBidScheduleService,
      private scheduleService:GeneratedScheduleService,
      private shiftDefSer:WorkLoadService,
      private localData: LocalDataService
    ) {
      this.route.queryParams.subscribe(params=>{
        this.bid_schedule_id=params.bidId
        this.round_id=params.round
      })
      // this.route.params.subscribe(params => {
      //   this.bid_schedule_name = params['_bidScheduleName'];
         // Print the parameter to the console.
    // });
     }

    ngOnInit() {
      this.user_data=JSON.parse(sessionStorage.getItem('userData'))
      this.headerTitleService.setTitle('Shiftline Bidding');
      this.headerTitleService.setDefaultHeader(false)
      this.managerid=this.user_data.id
      if(this.user_data.empid===undefined){
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.my_bidding);
      }else{
        this.headerTitleService.setBackUrl(straightlines_io_apis.apis.employee_home);
        this.empName=this.user_data.initials
        this.empId=this.user_data.empid
      }
      this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? straightlines_io_apis.apis.employee_home : straightlines_io_apis.apis.my_bidding);

      this.headerTitleService.setForwardUrl(null);
      this.headerTitleService.checkBiddingTime('biddingheader')
      // this.myBiddingSer.setTitle('step-1')
      this.passBidScheduleName.emit(this.bid_schedule_name)
      this.passroundId.emit(this.round_id)
      this.checkShiftLineScheduleId= JSON.parse(this.localData.getItem('selectShiftLineForBidding'))

      if(this.checkShiftLineScheduleId==null){
        this.checkShiftLineScheduleId=0
      }
      this.selected_schedule_for_bidding=JSON.parse(this.localData.getItem('myBiddingData'))
      this.passBidScheduleName.emit(this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name)
      this.passroundId.emit(this.round_id)
      // this.allBidRounds()
      this.widnowTranSer.getBidWindowDataBasedOnempId(this.user_data.empid).subscribe((res)=>{
        var temp=res
        this.allBidRoundData=[]
        var tempObj
        for(var i=0;i<temp.length;i++){
          if(temp[i].bidschidref===this.selected_schedule_for_bidding.currentBidScheduleId && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

            this.currentEmpData=temp[i]
            this.getAllShiftDefintionData()
            this.allShiftlinesData()
          }
        }

      },(err)=>{console.log(err)},()=>{})

      }
      allShift=[]
      allShiftDef=[]
      getAllShiftDefintionData(){
        this.shiftDefSer.getAllShiftDefinition(this.managerid).subscribe(
          (res)=>{
            this.allShift=res;
                var user_all_shift=[]
                for(var i=0;i<this.allShift.length;i++){
                  if(Number(this.allShift[i].userid)==Number(this.managerid)){
                    var convertTimetoString:any = Array.from(this.allShift[i].sh_starttime)
                    var sh_startTime=convertTimetoString[0] + convertTimetoString[1] + convertTimetoString[3]+convertTimetoString[4]
                      var shift_name=this.allShift[i].sh_name
                    user_all_shift.push({
                    "startTime": sh_startTime,
                    "shiftName":shift_name,
                    "shift_duration":this.allShift[i].sh_duration,
                    "shiftCategory":this.allShift[i].sh_category_id,
                    "shift_created_by":this.allShift[i].sh_created_by,
                    "sh_include_exclude":this.allShift[i].sh_include_exclude
                   })
                  }
                }
                for(var i=0;i<this.default_work_load_data.length;i++){
                    user_all_shift.push({
                    "startTime": this.default_work_load_data[i].startTime,
                    "shiftName":this.default_work_load_data[i].shiftName,
                    "shift_duration":this.default_work_load_data[i].shift_duration,
                    "shiftCategory":this.default_work_load_data[i].shiftCategory,
                    "shift_created_by":this.default_work_load_data[i].shift_created_by,
                    "sh_include_exclude":this.default_work_load_data[i].sh_include_exclude
                   })
                }
                this.allShiftDef=user_all_shift
          },

        (error: any)=>{console.log(error)
          var user_all_shift=[]
          for(var i=0;i<this.default_work_load_data.length;i++){
            user_all_shift.push({
            "startTime": this.default_work_load_data[i].startTime,
            "shiftName":this.default_work_load_data[i].shiftName,
            "shift_duration":this.default_work_load_data[i].shift_duration,
            "shiftCategory":this.default_work_load_data[i].shiftCategory,
            "shift_created_by":this.default_work_load_data[i].shift_created_by,
            "sh_include_exclude":this.default_work_load_data[i].sh_include_exclude
           })
          }
          this.allShiftDef=user_all_shift
      },
        ()=>{

        }
        );
      }
      allShiftlinesData(){
        this.bidShiftLineSer.getBidShiftlinesData(this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name).subscribe((res)=>{

          this.bid_shiftline=res
          this.getEmpSelectedShiftline=[]
            for(var i=0;i<this.bid_shiftline.length;i++){
              if(this.empId==this.bid_shiftline[i].empidref){
                this.getEmpSelectedShiftline.push(this.bid_shiftline[i])
              }
            }
          // this.selectedShiftLines=this.getEmpSelectedShiftline


          this.getAllDataBasedOnScheduleName()
        },(err)=>{console.log(err)},()=>{})
      }

      getAllDataBasedOnScheduleName(){
        this.newBidScheduleSer.getBidScheduleBasedOnBidScheduleIDgetAllBidScheduleData(this.selected_schedule_for_bidding.currentBidScheduleId).subscribe((res)=>{

          this.bidSchedule=res
          this.totalShiftlineScheduleLength=this.bidSchedule.shiftdefmap.length
          var count=0
          var totallength=this.totalShiftlineScheduleLength
          //  for(var j=0;j<this.totalShiftlineScheduleLength;j++){
          var tempArr=[],arr=[]
            for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
              arr=[]
              for(var k=0;k<this.bid_shiftline.length;k++){
              if(this.bidSchedule.shiftdefmap[i].shiftdefref==this.bid_shiftline[k].shiftidref ){
                arr.push(this.bid_shiftline[k])
              }
            }
            tempArr.push(arr)
          }
          var arr=[]
          for(i=0;i<tempArr.length;i++){

            arr.push(tempArr[i].length)
          }
          var min_length,count=0
          var finalcount=0
          min_length=Math.min.apply(null, arr)
          this.disableShiftlineSchedule=[]
          for(i=0;i<tempArr.length;i++){
            count=0
            for(var j=0;j<tempArr[i].length;j++){
              if(tempArr[i][j].empidref==null && this.currentEmpData.empseq_id<=tempArr[i].length){
                count++

              }
            }
            if(count>0){

              finalcount++
            }else{
              this.disableShiftlineSchedule.push(tempArr[i][0].shiftidref)
            }
          }
          var temp
          temp=this.totalShiftlineScheduleLength+ - +finalcount
          this.totalShiftlineScheduleLength=this.totalShiftlineScheduleLength+ - +temp
          if(this.getEmpSelectedShiftline.length===this.bidSchedule.shiftdefmap.length){
            this.checkAllShiftLineSelected=true
          }else{
            this.checkAllShiftLineSelected=false
          }
          this.getAllBidRound()
          this.getAllShiftLineSchedule()

        },(err)=>{console.log(err)},()=>{})
      }
      getAllBidRound(){

        this.all_SBP_rounds=this.bidSchedule.roundmap
      }
      getAllShiftLineSchedule(){
        this.shiftLinesSchedule=new Array()
        for(var i=0;i<this.bidSchedule.shiftdefmap.length;i++){
        this.scheduleService.newgetAllShiftLinesBasedOnScheduleId(this.bidSchedule.shiftdefmap[i].shiftdefref).subscribe((res)=>{
          this.shiftlineScheduleData=res[0]

          this.shiftLinesSchedule.push(this.shiftlineScheduleData)
          this.convertArrayData()
        },(err)=>{console.log(err)},()=>{})
      }

      this.convertArrayData()
        // this.currentShiftLineSchedule(this.all_final_data[this.checkShiftLineScheduleId])
      }
      convertArrayData(){
        var tempArr=new Array()
        tempArr=this.shiftLinesSchedule
        this.all_final_data=new Array()
        for(var i=0;i<tempArr.length;i++){
          for(var j=0;j<this.bidSchedule.shiftdefmap.length;j++){
            if(tempArr[i].sh_schedule_id===this.bidSchedule.shiftdefmap[j].shiftdefref){
              var temp={
                "schedulename":tempArr[i].schedulename,
                "bidschedulestartdate":this.bidSchedule.shiftdefmap[j].shiftdefstartdate,
                "bidscheduleenddate":this.bidSchedule.shiftdefmap[j].shiftdefenddate,
                "shiftdefref":this.bidSchedule.shiftdefmap[j].shiftdefref,
                "bidschid":this.bidSchedule.bidschid,
                "shiftlineLength":tempArr[i].schild.length,
                "schild":tempArr[i].schild
              }
              this.all_final_data.push(temp)
            }
          }
        }


        this.all_final_data=this.all_final_data.sort(function(a,b){

          return new Date(Number(a.bidschedulestartdate.split('-')[0]),Number(a.bidschedulestartdate.split('-')[1])+ - +1,Number(a.bidschedulestartdate.split('-')[2]),0,0,0).getTime() - new Date(Number(b.bidschedulestartdate.split('-')[0]),Number(b.bidschedulestartdate.split('-')[1])+ - +1,Number(b.bidschedulestartdate.split('-')[2]),0,0,0).getTime() ;
        });

      }
      latestIndexBox=0
      scrollIdBox
      expandBox(index){

        this.latestIndexBox=index
        this.scrollIdBox=  document.getElementById("targetBlock"+this.latestIndexBox);
        if(this.expand_id==index){
          this.expand_id=null
          this.expand_shiftid=null
          this.slideOption.initialSlide=0
        }else{
          this.expand_id=index
        }
      }

      checkCSS(name){
        if(name!=this.empName &&  name!=''){
          return 'deactivate'
        }else{
          return 'active'
        }
      }

      displayRoundData(data,index){

        this.currentactiveRoundNumber=index
      }




      current_shift_line_schedule_id

  async checkShiftLineSchedule(j,selectedSchedule){
  //
var check=false
  for(var i=0;i<this.disableShiftlineSchedule.length;i++){
    if(selectedSchedule.shiftdefref==this.disableShiftlineSchedule[i]){

      check=true
    }
  }
  if(check==true){

  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Alert',
    message: 'No shiftlines are available!',
    buttons: [{text:'OK', handler: () => {

    }
    }]

  });
  await alert.present();
  }else{
  this.expandBox(j)
  this.selectShiftLineSchedule(selectedSchedule)
  }

}
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
                "pattern":tempArr[i].pattern,
                "shiftname":tempArr[i].shiftname,
                "seq_id":tempArr[i].seq_id,
                "selectedBy":'',

                "frishift2":tempArr[i].frishift2,
                "monshift2":tempArr[i].monshift2,
                "satshift2":tempArr[i].satshift2,

                "shiftdurationc": tempArr[i].shiftdurationc,
                "sunshift2":tempArr[i].sunshift2,
                "thushift2": tempArr[i].thushift2,
                "tueshift2": tempArr[i].tueshift2,
                "wedshift2": tempArr[i].wedshift2
              }
              this.all_selected_schedule_shift_lines.push(temp)
          }
          var tempArr=[],tempObj

          for(var i=0;i<this.bid_shiftline.length;i++){
            for(var j=0;j<this.all_selected_schedule_shift_lines.length;j++){

              if(this.bid_schedule_id==this.bid_shiftline[i].bidschidref &&this.bid_shiftline[i].schedulename==this.current_shift_line_schedule &&Number(this.current_shift_line_schedule_id) == this.bid_shiftline[i].shiftidref && this.all_selected_schedule_shift_lines[j].id ==this.bid_shiftline[i].shiftlineidref){
               if(this.bid_shiftline[i].initials!=""){
                tempObj=  {
                  "scheduleName":this.bid_shiftline[i].schedulename,
                    "id":this.all_selected_schedule_shift_lines[j].id,
                    "bidid":this.bid_shiftline[i].bidid,
                    "shiftlineid":this.bid_shiftline[i].shiftidref,
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
                    "frishift2":this.all_selected_schedule_shift_lines[j].frishift2,
                    "monshift2":this.all_selected_schedule_shift_lines[j].monshift2,
                    "satshift2":this.all_selected_schedule_shift_lines[j].satshift2,

                    "shiftdurationc": this.all_selected_schedule_shift_lines[j].shiftdurationc,
                    "sunshift2":this.all_selected_schedule_shift_lines[j].sunshift2,
                    "thushift2": this.all_selected_schedule_shift_lines[j].thushift2,
                    "tueshift2":this.all_selected_schedule_shift_lines[j].tueshift2,
                    "wedshift2": this.all_selected_schedule_shift_lines[j].wedshift2,
                    "selectedBy":this.bid_shiftline[i].initials,
                    "edit_seq_id":this.checkID(this.all_selected_schedule_shift_lines[j].seq_id,this.all_selected_schedule_shift_lines[j].shiftname,this.all_selected_schedule_shift_lines),
                    "bidstatus":this.bid_shiftline[i].bidstatus,
                    "empidref":this.bid_shiftline[i].empidref,
                  }
                  if(this.empId==this.bid_shiftline[i].empidref){
                    var check=this.selectedShiftLines.some(shiftline => shiftline.bidid === this.bid_shiftline[i].bidid)

                    if(check==false){
                      this.empSelectedShiftLine={"shiftline":tempObj}
                      this.selectedShiftLines.push(tempObj)
                    }
                  }

               }else{
                tempObj=  {
                  "id":this.all_selected_schedule_shift_lines[j].id,
                  "scheduleName":this.bid_shiftline[i].schedulename,
                  "bidid":this.bid_shiftline[i].bidid,
                  "shiftlineid":this.bid_shiftline[i].shiftidref,
                  "sun":this.all_selected_schedule_shift_lines[j].sun,
                  "mon":this.all_selected_schedule_shift_lines[j].mon,
                  "tue":this.all_selected_schedule_shift_lines[j].tue,
                  "wed":this.all_selected_schedule_shift_lines[j].wed,
                  "frishift2":this.all_selected_schedule_shift_lines[j].frishift2,
                  "monshift2":this.all_selected_schedule_shift_lines[j].monshift2,
                  "satshift2":this.all_selected_schedule_shift_lines[j].satshift2,

                  "shiftdurationc": this.all_selected_schedule_shift_lines[j].shiftdurationc,
                  "sunshift2":this.all_selected_schedule_shift_lines[j].sunshift2,
                  "thushift2": this.all_selected_schedule_shift_lines[j].thushift2,
                  "tueshift2":this.all_selected_schedule_shift_lines[j].tueshift2,
                  "wedshift2": this.all_selected_schedule_shift_lines[j].wedshift2,
                  "edit_seq_id":this.checkID(this.all_selected_schedule_shift_lines[j].seq_id,this.all_selected_schedule_shift_lines[j].shiftname,this.all_selected_schedule_shift_lines),
                  "thu":this.all_selected_schedule_shift_lines[j].thu,
                  "fri":this.all_selected_schedule_shift_lines[j].fri,
                  "sat":this.all_selected_schedule_shift_lines[j].sat,
                  "pattern":this.all_selected_schedule_shift_lines[j].pattern,
                  "shiftname":this.all_selected_schedule_shift_lines[j].shiftname,
                  "seq_id":this.all_selected_schedule_shift_lines[j].seq_id,
                  "selectedBy":'',
                  "bidstatus":this.bid_shiftline[i].bidstatus,
                  "empidref":this.bid_shiftline[i].empidref,
                }
               }
               tempArr.push(tempObj)
              }
            }
          }
          this.all_selected_schedule_shift_lines=[]
          this.all_selected_schedule_shift_lines=tempArr

        //   if(this.selectedShiftLines.length===this.totalShiftlineScheduleLength){
        //   this.checkAllShiftLineSelected=true
        // }else{
        //   this.checkAllShiftLineSelected=false
        // }
      }








      dateFormat(date){
        return new Date(date.split("-")[0],Number(date.split("-")[1])+ - +1, date.split("-")[2],0 ,0, 0);
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
                "pattern":tempArr[i].pattern,
                "shiftname":tempArr[i].shiftname,
                "seq_id":tempArr[i].seq_id,
                "selectedBy":'',

                "frishift2":tempArr[i].frishift2,
                "monshift2":tempArr[i].monshift2,
                "satshift2":tempArr[i].satshift2,

                "shiftdurationc": tempArr[i].shiftdurationc,
                "sunshift2":tempArr[i].sunshift2,
                "thushift2": tempArr[i].thushift2,
                "tueshift2": tempArr[i].tueshift2,
                "wedshift2": tempArr[i].wedshift2
              }
              this.all_selected_schedule_shift_lines.push(temp)
          }

        },(err)=>{console.log(err)},()=>{})
      }
      expand(index){
        if(this.expand_shiftid==index){
          this.expand_shiftid=null
          this.cdref.detectChanges()
          this.slideOption.slidesPerView=5
          this.cdref.detectChanges()
        }else{
          this.expand_shiftid=index
          this.cdref.detectChanges()
          if(this.all_selected_schedule_shift_lines.length==(this.expand_shiftid+ + +1)){
            this.slideOption.slidesPerView=2
            }else{
              this.slideOption.slidesPerView=4
            }
          this.cdref.detectChanges()
        }
      }
      myAnimateclass(i){
        if(this.all_selected_schedule_shift_lines.length==(this.expand_shiftid+ + +1)){
          return 'all-shift-list'
        }else{
          return 'default-all-shift-list'
        }
      }
      expandlistSlide(i){
          if(this.expand_shiftid==i){
            return 'expand-slide'
          }else{
            return 'default-expand-slide'
          }
      }
      expandlist(i){
        if(this.expand_shiftid==i){
          return 'expand'
        }else{
          return 'default-expand'
        }
      }

      latestIndex=0
      scrollId
      selectShiftLine(selectedShiftLine,index){
        this.latestIndex=index
        this.bottomSpinner=true
        this.scrollId=  document.getElementById("target"+this.latestIndex);


        this.empSelectedShiftLine={"shiftline":selectedShiftLine}
        var tempArr=[]
        tempArr=this.all_selected_schedule_shift_lines
        this.all_selected_schedule_shift_lines=[]
        var temp
        for(var i=0;i<tempArr.length;i++){
          if(selectedShiftLine.id===tempArr[i].id){
            temp={
              "id":tempArr[i].id,
              "bidid":tempArr[i].bidid,
              "sun":tempArr[i].sun,
              "mon":tempArr[i].mon,
              "tue":tempArr[i].tue,
              "wed":tempArr[i].wed,
              "thu":tempArr[i].thu,
              "fri":tempArr[i].fri,
              "sat":tempArr[i].sat,
              "edit_seq_id":this.checkID(tempArr[i].seq_id,tempArr[i].shiftname,tempArr),
              "pattern":tempArr[i].pattern,
              "shiftname":tempArr[i].shiftname,
              "shiftlineid":tempArr[i].shiftlineid,
              "seq_id":tempArr[i].seq_id,
              "bidstatus":'Eligible',
              "selectedBy":this.empName,
              "scheduleName":tempArr[i].scheduleName,
              "empidref":this.empId,

              "frishift2":tempArr[i].frishift2,
              "monshift2":tempArr[i].monshift2,
              "satshift2":tempArr[i].satshift2,

              "shiftdurationc": tempArr[i].shiftdurationc,
              "sunshift2":tempArr[i].sunshift2,
              "thushift2": tempArr[i].thushift2,
              "tueshift2": tempArr[i].tueshift2,
              "wedshift2": tempArr[i].wedshift2
            }
            this.selectedShiftLines.push(temp)

            // if(this.selectedShiftLines.length>1){
            //     var result = this.selectedShiftLines.filter(shiftline => shiftline.bidid!==temp.bidid);
            //     this.selectedShiftLines=result
            //   }


              this.updateShiftLine(temp)
          }else{

            if(this.empId==tempArr[i].empidref){
              temp={
                "id":tempArr[i].id,
                "bidid":tempArr[i].bidid,
                "sun":tempArr[i].sun,
                "mon":tempArr[i].mon,
                "tue":tempArr[i].tue,
                "wed":tempArr[i].wed,
                "thu":tempArr[i].thu,
                "fri":tempArr[i].fri,
                "sat":tempArr[i].sat,
                "pattern":tempArr[i].pattern,
                "shiftname":tempArr[i].shiftname,
                "edit_seq_id":this.checkID(tempArr[i].seq_id,tempArr[i].shiftname,tempArr),
                "shiftlineid":tempArr[i].shiftlineid,
                "seq_id":tempArr[i].seq_id,
                "scheduleName":tempArr[i].scheduleName,
                "selectedBy":'',
                "bidstatus":'Eligible',
                "empidref":'',

                "frishift2":tempArr[i].frishift2,
                "monshift2":tempArr[i].monshift2,
                "satshift2":tempArr[i].satshift2,

                "shiftdurationc": tempArr[i].shiftdurationc,
                "sunshift2":tempArr[i].sunshift2,
                "thushift2": tempArr[i].thushift2,
                "tueshift2": tempArr[i].tueshift2,
                "wedshift2": tempArr[i].wedshift2
              }
             var result = this.selectedShiftLines.filter(shiftline => shiftline.bidid!==temp.bidid);
             this.selectedShiftLines=result
              this.updateShiftLine(temp)
            }else{
              temp={
                "id":tempArr[i].id,
                "bidid":tempArr[i].bidid,
                "sun":tempArr[i].sun,
                "mon":tempArr[i].mon,
                "tue":tempArr[i].tue,
                "wed":tempArr[i].wed,
                "thu":tempArr[i].thu,
                "fri":tempArr[i].fri,
                "sat":tempArr[i].sat,
                "pattern":tempArr[i].pattern,
                "shiftname":tempArr[i].shiftname,
                "seq_id":tempArr[i].seq_id,
                "shiftlineid":tempArr[i].shiftlineid,
                "edit_seq_id":this.checkID(tempArr[i].seq_id,tempArr[i].shiftname,tempArr),
                "scheduleName":tempArr[i].scheduleName,
                "selectedBy":tempArr[i].selectedBy,
                "bidstatus":tempArr[i].bidstatus,
                "empidref":tempArr[i].empidref,

                "frishift2":tempArr[i].frishift2,
                "monshift2":tempArr[i].monshift2,
                "satshift2":tempArr[i].satshift2,

                "shiftdurationc": tempArr[i].shiftdurationc,
                "sunshift2":tempArr[i].sunshift2,
                "thushift2": tempArr[i].thushift2,
                "tueshift2": tempArr[i].tueshift2,
                "wedshift2": tempArr[i].wedshift2
              }

            }
                      }
            this.all_selected_schedule_shift_lines.push(temp)
        }

        // if(this.selectedShiftLines.length===this.totalShiftlineScheduleLength){
        //   this.checkAllShiftLineSelected=true
        // }else{
        //   this.checkAllShiftLineSelected=false
        // }
        this.slideOption.initialSlide=this.expand_shiftid
        this.expand(index)

      }
      bottomSpinner=false
      updateShiftLine(shiftLineData){


  var tempObj=        {
          "bidid": shiftLineData.bidid,
          "bidstatus": shiftLineData.bidstatus,
          "windowstatus": '',
          "empwindowduration": null,
          "empwindowstartdateandtime": '',
          "bidschidref": this.selected_schedule_for_bidding.currentBidScheduleId,
          "bidschename": this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name,
          "empidref": shiftLineData.empidref,
          "initials": shiftLineData.selectedBy,
          "roundseq_id": 1,
          "schedulename": shiftLineData.scheduleName,
          "shiftseq_id": shiftLineData.seq_id+ + +1,
          "shiftname": shiftLineData.shiftname+'-'+(Number(shiftLineData.edit_seq_id)+ + +1),
          "pattern": shiftLineData.pattern,
          "shiftidref":shiftLineData.shiftlineid,
          "shiftlineidref":shiftLineData.id
        }

        this.bidShiftLineSer.updateBidShiftlineData(shiftLineData.bidid,tempObj).subscribe((res)=>{

          this.bidShiftLineSer.getBidShiftlinesData(this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name).subscribe((res)=>{

            this.bid_shiftline=res
            this.getEmpSelectedShiftline=[]
            for(var i=0;i<this.bid_shiftline.length;i++){
              if(this.empId==this.bid_shiftline[i].empidref){

                this.getEmpSelectedShiftline.push(this.bid_shiftline[i])
              }

            }
            var totallength=0

            totallength=this.getEmpSelectedShiftline.length
            this.bottomSpinner=false
            if(totallength===this.totalShiftlineScheduleLength){
              this.checkAllShiftLineSelected=true
            }else{
              this.checkAllShiftLineSelected=false
            }
          },(err)=>{console.log(err)},()=>{})
        },(err)=>{console.log(err)},()=>{})
      }
      all_window_data=[]
      getEmpSelectedShiftline=[]
      finalViewBidWindowData
      checkIDTwo(id,sl,scheduleShift){
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
        return sl+'-'+(newid++ +1)
      }
      getEmpSelectedShiftlines(sName){
        for(var i=0;i<this.getEmpSelectedShiftline.length;i++){
          if(sName.shiftdefref==this.getEmpSelectedShiftline[i].shiftidref && this.getEmpSelectedShiftline[i].empidref==this.empId){
            var tempArr=[],currentShiftlineName=''
            var scheduleShift=sName.schild
              if(this.getEmpSelectedShiftline[i].shiftname.split("-").length==3){
                currentShiftlineName=this.getEmpSelectedShiftline[i].shiftname.split("-")[0]+'-'+this.getEmpSelectedShiftline[i].shiftname.split("-")[1]
              }else{
                currentShiftlineName=this.getEmpSelectedShiftline[i].shiftname.split("-")[0]
              }
              for(var j=0; j<=scheduleShift.length;j++){
                if(scheduleShift[j] !=undefined){
                  if(String(scheduleShift[j].shiftname) == String(currentShiftlineName) ){
                  tempArr.push(Number(scheduleShift[j].seq_id))
                  }
                }
              }
              tempArr=tempArr.sort((a,b)=>{return a -b})
              var newid=tempArr.indexOf(this.getEmpSelectedShiftline[i].shiftseq_id+ - +1)
              return currentShiftlineName+'-'+(newid+ + +1)
          }
        }
      }
      checkSelectedEmpShiftLine(sName){
        for(var i=0;i<this.getEmpSelectedShiftline.length;i++){
          if(sName==this.getEmpSelectedShiftline[i].schedulename){
            return true
          }
        }
      }
      next(){
        this.selectedShiftLines= this.getEmpSelectedShiftline
        var shiftLineData

        for(var i=0;i<this.selectedShiftLines.length;i++){
          shiftLineData=this.selectedShiftLines[i]

        var tempObj=        {
          "bidid": shiftLineData.bidid,
          "bidstatus": 'Completed',
          "windowstatus": '',
          "empwindowduration": null,
          "empwindowstartdateandtime": '',
          "bidschidref":  this.bid_schedule_id,
          "bidschename":this.selected_schedule_for_bidding.bid_schedule_name.bid_schedule_name,
          "empidref": shiftLineData.empidref,
          "initials": shiftLineData.initials,
          "roundseq_id": 1,
          "schedulename": shiftLineData.schedulename,
          "shiftseq_id": shiftLineData.shiftseq_id,
          "shiftname": shiftLineData.shiftname,
          "pattern": shiftLineData.pattern,
          "shiftidref":shiftLineData.shiftidref,
          "shiftlineidref":shiftLineData.shiftlineidref
        }

        this.bidShiftLineSer.updateBidShiftlineData(shiftLineData.bidid,tempObj).subscribe((res)=>{

        },(err)=>{console.log(err)},()=>{})
      }
      if(this.bidSchedule.shiftdefmap.length===this.selectedShiftLines.length){
        this.widnowTranSer.getBidWindowDataBasedOnempId(this.user_data.empid).subscribe((res)=>{
          var temp=res
          this.allBidRoundData=[]
          var tempObj
          for(var i=0;i<temp.length;i++){
            if(temp[i].bidschidref===this.selected_schedule_for_bidding.currentBidScheduleId && (Number(this.round_id)+ + +1)===temp[i].roundseq_id){

              tempObj=temp[i]

            }
          }
          var today,date,invdate,diff
          date = new Date();
          invdate = new Date(date.toLocaleString('en-US', {
            timeZone: this.bidShculeTimeZone
          }));
           diff = date.getTime() - invdate.getTime();
           today=new Date(date.getTime() - diff)
          var currentdate = today;
          var updatedCurrentTime= currentdate.getFullYear()+ '-'+ (currentdate.getMonth()+1)    +'-'+currentdate.getDate() + ' '+ currentdate.getHours() + ":"+ currentdate.getMinutes() +':00'

          var tempNewObj={
              "duid": tempObj.duid,
              "bidschidref": tempObj.bidschidref,
              "bidschename": tempObj.bidschename,
              "empidref": tempObj.empidref,
              "initials": tempObj.initials,
              "rank": tempObj.rank,
              "roundseq_id": tempObj.roundseq_id,
              "bidstartdate": tempObj.bidstartdate,
              "bidenddate": tempObj.bidenddate,
              "bidstarttime": tempObj.bidstarttime,
              "bidendtime": tempObj.bidendtime,
              "empbidduration": tempObj.empbidduration,
              "shiftlinebidstatus": "Completed",
              "vacationbidstatus":tempObj.vacationbidstatus,
              "empbid_end_time":tempObj.empbid_end_time.split('.')[0],
              "empbid_start_time":tempObj.empbid_start_time.split('.')[0],
              "fname": tempObj.fname,
              "lname": tempObj.lname,
              "trans_seq_id":tempObj.trans_seq_id,
              "empseq_id": tempObj.empseq_id
          }
          this.widnowTranSer.updateBidWindowData(tempObj.duid,tempNewObj).subscribe((res)=>{
              var updatedRes
               updatedRes=res
          },(err)=>{console.log(err)},()=>{})
        },(err)=>{console.log(err)},()=>{})
      }

        if(this.user_data.empid==undefined){
          let navigationExtras: NavigationExtras = {
            queryParams: {
              bidId: this.bid_schedule_id,
              round:this.round_id,
              id: this.managerid
            }
          };
          this.navCtrl.navigateForward(straightlines_io_apis.apis.select_bid_leave_option)
        }else{
          let navigationExtras: NavigationExtras = {
            queryParams: {
              bidId: this.bid_schedule_id,
              round:this.round_id,
              id: this.managerid
            }
          };
          this.navCtrl.navigateForward(straightlines_io_apis.apis.employee_bid_leave_option,navigationExtras)
        }

      }
      getIndicatorClass(index){
        if(this.currentactiveRoundNumber===index){
          return ' app-background-mercurius-secondary-color'
        }else{
          return 'app-font-mercurius-secondary-color'
        }

      }
      resetClass() {
        setTimeout(() => {
          this.cd.detectChanges();
          this.myAnimateClass = 'myAnimateClass';
          this.myAnimateClassButton='myAnimateClassButton'
          this.cd.detectChanges();
        },100);
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
      openShiftDefintionPopup(scId,shId,day){
        this.popUpId=String(scId)+String(shId)+day
        this.checkClickForPopup=true
        var popup = document.getElementById("popup"+this.popUpId);
        if(popup!=null){
          popup.style.visibility='visible'
        }
        if(this.oldPopUpId!=undefined ){
          var oldPopup = document.getElementById("popup"+this.oldPopUpId);
          if(oldPopup!=null){
            oldPopup.style.visibility='hidden'
          }
        }
        this.cdref.detectChanges()
        if(this.popUpId==this.oldPopUpId){
          this.oldPopUpId=undefined
        }else{
          this.oldPopUpId=this.popUpId
        }

      }
      checkClickForPopup=false
      oldPopUpId
      popUpId
      popoverState=false
      disablePopup(){
        if(this.oldPopUpId!=undefined && this.checkClickForPopup==false){
          var oldPopup = document.getElementById("popup"+this.oldPopUpId);
          if(oldPopup!=null){
            oldPopup.style.visibility='hidden'
          }
        }
        this.checkClickForPopup=false
      }
      getShiftDef(sh_name,sl_len){
        var shiftTime=''
        for(var i=0;i<this.allShiftDef.length;i++){
          if(sl_len!=9){
            if(this.allShiftDef[i].shift_duration==sl_len && this.allShiftDef[i].shiftName==sh_name ){
              shiftTime=this.allShiftDef[i].startTime+' (' + String( this.allShiftDef[i].shift_duration)+'hr)'
            }
          }else{
            if(this.allShiftDef[i].shift_duration==Number(sh_name.split('-')[1]) && this.allShiftDef[i].shiftName==sh_name.split('-')[0] ){
              shiftTime=this.allShiftDef[i].startTime+' (' + String( this.allShiftDef[i].shift_duration)+'hr)'
            }
          }

        }
        return shiftTime
      }
  }
