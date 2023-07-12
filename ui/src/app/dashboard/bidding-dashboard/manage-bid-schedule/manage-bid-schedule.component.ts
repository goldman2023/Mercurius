import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { BidLeaveSetupService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-leave-setup.service';
import { SetupBidRoundService } from 'src/app/services/manage-bid-schedule/bid-schedule/setup-bid-round.service';
import { CreateNewBidScheduleService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/create-new-bid-schedule.service';
import { BidScheduleActionSheetComponent } from './bid-schedule-action-sheet/bid-schedule-action-sheet.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';

@Component({
  selector: 'app-manage-bid-schedule',
  templateUrl: './manage-bid-schedule.component.html',
  styleUrls: ['./manage-bid-schedule.component.scss'],
})
export class ManageBidScheduleComponent implements OnInit {

bid_schedule=[]
selectYearForm:FormGroup
minDateForBidRound

years=[]
  all_bid_schedule: any;
  bid_schedule_length: any;
  user_data: any;
  all_SBP_rounds: any[];
  allScheduleData: any[];
  all_Bid_schedule_list = [];
  all_data = [];
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    private headerTitleService: HeaderTitleService,
    private bidSer:BidScheduleService,
    public modalCtrl: ModalController,
    private bidLeaveSer:BidLeaveSetupService,
    private bidRoundSer:SetupBidRoundService,
    private newBidScheduleSer:CreateNewBidScheduleService,
    private setUPbidRoundSer:SetupBidRoundService,
    private formBuilder:FormBuilder,
    private localData: LocalDataService
    ) { }

  ngOnInit() {

    this.headerTitleService.setTitle('Manage Bid Schedule');
    this.headerTitleService.setDefaultHeader(false)
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.bidding);
    this.headerTitleService.setForwardUrl(null);
    this.headerTitleService.checkBiddingTime('');
    this.headerTitleService.checkBiddingEndDate('');
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
  //   this.bid_schedule=this.data


  //  this.bid_schedule=this.all_bid_schedule
   this.getAllBidSchedule()
    this.allBidScheduleList()
  //  if(this.bid_schedule!==null){
  //  this.bid_schedule_length=this.bid_schedule.length

  //  }

    this.selectYearForm = this.formBuilder.group({
      year:new FormControl("select year"),
    })

   
  }

  get year(){
    return  this.selectYearForm.get("year")
    }
    ionViewWillEnter(){
      this.ngOnInit()
     }
    allBidScheduleList(){
      this.newBidScheduleSer.getAllBidScheduleData(this.user_data.id).subscribe((res)=>{

        this.all_Bid_schedule_list=[]
        this.all_data = res
        if(this.all_data.length>0){
          this.all_data.sort((a, b) => { return b.bidschid - a.bidschid });
          this.all_Bid_schedule_list = this.all_data.filter(item => item.summaryemail !== null);
        }

      },(err)=>{console.log(err)},()=>{})
    }
    deleteBidScheduleFromList(bidScheduleData){
      this.newBidScheduleSer.deleteAllDataBasedOnBidScheduleId(bidScheduleData.bidschid).subscribe((res)=>{

      },(err)=>{console.log(err)},()=>{
        this.ngOnInit()
      })

    }

async editBidScheduleFromList(bs, e){
    const modal = await this.modalCtrl.create({
      component: BidScheduleActionSheetComponent,
      cssClass: `action-sheet-for-shiftline-schedule action-sheet-for-shiftline-schedule-upto-md `,
      componentProps: { bidSchedule_data:bs},
      swipeToClose:true
    });
    modal.onDidDismiss()
    .then((data) => {
      if(data.data==='delete'){
        this.ngOnInit()
      }
    });
    modal.style.setProperty('--position-x', `${e.x - 125}px`);
        modal.style.setProperty('--position-y', `${e.y}px`);
    return await modal.present();
}

    getAllBidSchedule(){
      this.bidSer.getAllBidSchedule(this.user_data.id).subscribe((res)=>{

        var temp
        temp=this.multiDimensionalUnique(res);
        this.bid_schedule=temp
        this.all_bid_schedule=this.bid_schedule
        var temp
        //
        if(this.bid_schedule!==null){
        for(var i=0;i<this.bid_schedule.length;i++){
          temp=new Date(this.bid_schedule[i].schedule_start_date).getFullYear()
          this.years.push(temp)

        }

        this.years.sort()
        this.years= this.years.filter((y, index) => {
          return this.years.indexOf(y) === index;
      });}
       },(err)=>{
         console.log(err)
       },()=>{})
    }
     multiDimensionalUnique(arr) {


      var uniques = [];
      var itemsFound = {};
      for(var i = 0, l = arr.length; i < l; i++) {
          var stringified = JSON.stringify(arr[i]);
          if(itemsFound[stringified]) { continue; }
          uniques.push(arr[i]);
          itemsFound[stringified] = true;
      }
      var tempArr=[]


      for(var i=0;i<uniques.length;i++){
        if(uniques[i].bidschedulestartdate!=undefined){
        var startDate=uniques[i].bidschedulestartdate.split("-");
        var endDate=uniques[i].bidscheduleenddate.split("-");
        var finalObj={'bid_schedule_name':uniques[i].bidschedulename,'schedule_start_date':new Date(startDate[0],Number(startDate[1])+ - +1, startDate[2],0 ,0, 0),'schedule_end_date':new Date(endDate[0],Number(endDate[1])+ - +1, endDate[2],0 ,0, 0),'setUpBidParameter':uniques[i].paramsavestatus,'leaveSetUp':uniques[i].leavesavestatus,'bidRound':uniques[i].roundsavestatus}
        tempArr.push(finalObj)
      }
    }
      var dates=[],tempFinalArr=[]
      for(var i=0;i<tempArr.length;i++){
        var dates=[]
        for(var j=0;j<tempArr.length;j++){
          if(tempArr[i].bid_schedule_name==tempArr[j].bid_schedule_name){
            dates.push(new Date(tempArr[j].schedule_end_date))
            dates.push(new Date(tempArr[j].schedule_start_date))
            var maxDate=new Date(Math.max.apply(null,dates));
            var minDate=new Date(Math.min.apply(null,dates));
          }
        }
        tempFinalArr.push({'bid_schedule_name':uniques[i].bidschedulename,'schedule_start_date':uniques[i].bidstartdate,'schedule_end_date':maxDate,'setUpBidParameter':uniques[i].paramsavestatus,'leaveSetUp':uniques[i].leavesavestatus,'bidRound':uniques[i].roundsavestatus})
      }
      var finalArr=tempFinalArr.filter((v,i,a)=>a.findIndex(t=>(t.bid_schedule_name === v.bid_schedule_name))===i)
      return finalArr.reverse();;

  }
    changeYear(){
      var temp

      this.bid_schedule=[]
      if(this.selectYearForm.value.year!=="select year"){
        for(var i=0;i<this.all_bid_schedule.length;i++){
          // if(this.data[i].from)
          // temp=this.data[i].from.substr(this.data[i].from.indexOf('/')+2)

          temp=new Date(this.all_bid_schedule[i].schedule_start_date).getFullYear()
          // temp= temp.split('/').pop();
          if(Number(temp)==Number(this.selectYearForm.value.year)){
            this.bid_schedule.push(this.all_bid_schedule[i])
          }
        }
      }else{
        this.bid_schedule=this.all_bid_schedule
      }
      //
    }
    addNewBidSchedule(){
      this.localData.removeItem('setUpBidScheduleOne')
      this.navCtrl.navigateForward([straightlines_io_apis.apis.create_new_bid_schedule])
      // this.navCtrl.navigateForward([straightlines_io_apis.apis.setUp_bid_parameters])
    }
    addNewAssignBidSchedule() {
    this.localData.removeItem('setUpBidScheduleOne')
    this.navCtrl.navigateForward([straightlines_io_apis.apis.assign_bid_schedule])
    
  }
    myBidding(){
      this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding])
    }

    async deleteBidSchedule(data){


      this.setUPbidRoundSer.getAllBidRoundBasedOnBidScheduleName(data.bid_schedule_name).subscribe(
        async (res)=>{


          this.all_SBP_rounds=[]
          this.all_SBP_rounds=res
          var tempArr=[],startDate,endDate
          if(this.all_SBP_rounds.length>0){
          for(var i=0;i<this.all_SBP_rounds.length;i++){
            startDate = this.all_SBP_rounds[i].bidroundstartdate.split("-")
            startDate=new Date(startDate[0],Number(startDate[1])+ -+1,startDate[2],0,0,0)
            endDate = this.all_SBP_rounds[i].bidroundenddate.split("-")
            endDate=new Date(endDate[0],Number(endDate[1])+ -+1,endDate[2],0,0,0)
            tempArr.push(startDate)
            tempArr.push(endDate)

          }
          var maxDate=new Date(Math.max.apply(null,tempArr));
          var minDate=new Date(Math.min.apply(null,tempArr));

          var currentDate
          currentDate=new Date()

          if(minDate>currentDate){

            this.goToDelete(data)
          }else{
            const confirm = await this.alertCtrl.create({
              header: 'Alert',
              message: 'This bidding in progress.',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {

                  }
                },
                ]})
                await confirm.present();
          }
        }else{
          this.goToDelete(data)
        }
        },
        (err)=>{
          console.log(err)
        },
        ()=>{}
      )


    }
    async goToDelete(data){

      const confirm = await this.alertCtrl.create({
        header: 'Are you sure?',
        message: 'Are you sure you want to delete the record?',
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

              this.bidSer.deleteBidSchedule(data.bid_schedule_name).subscribe(async (res)=>{


              },
              (err)=>{console.log(err)},
              ()=>{
                this.getAllBidSchedule()
              })
              this.bidLeaveSer.deleteBidLeave(data.bid_schedule_name).subscribe((res)=>{

              },
              (err)=>{console.log(err)},
              ()=>{
                this.getAllBidSchedule()
              })
              this.bidRoundSer.deleteBidRound(data.bid_schedule_name).subscribe((res)=>{

              },
              (err)=>{console.log(err)},
              ()=>{
                this.getAllBidSchedule()
              })
            }
          }]
          })
          await confirm.present();


    }
    editBidSchedule(bidSchedule){

      this.setUPbidRoundSer.getAllBidRoundBasedOnBidScheduleName(bidSchedule.bid_schedule_name).subscribe(
        async (res)=>{


          this.all_SBP_rounds=[]
          this.all_SBP_rounds=res
          var tempArr=[],startDate,endDate
          if(this.all_SBP_rounds.length>0){
          for(var i=0;i<this.all_SBP_rounds.length;i++){
            startDate = this.all_SBP_rounds[i].bidroundstartdate.split("-")
            startDate=new Date(startDate[0],Number(startDate[1])+ -+1,startDate[2],0,0,0)
            endDate = this.all_SBP_rounds[i].bidroundenddate.split("-")
            endDate=new Date(endDate[0],Number(endDate[1])+ -+1,endDate[2],0,0,0)
            tempArr.push(startDate)
            tempArr.push(endDate)

          }
          var maxDate=new Date(Math.max.apply(null,tempArr));
          var minDate=new Date(Math.min.apply(null,tempArr));


          var currentDate
          currentDate=new Date()

          if(minDate>currentDate){

            this.goToEdit(bidSchedule)
          }else{
            const confirm = await this.alertCtrl.create({
              header: 'Alert',
              message: 'This bidding in progress.',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {

                  }
                },
                ]})
                await confirm.present();
          }
        }else{
          this.goToEdit(bidSchedule)
        }
        },
        (err)=>{
          console.log(err)
        },
        ()=>{}
      )

    }

    goToEdit(bidSchedule){

      this.allShceduleBasedOnBidScheduleName(bidSchedule.bid_schedule_name,bidSchedule)

    }
    allShceduleBasedOnBidScheduleName(b_schedule_name,bidSchedule){
      if(b_schedule_name!==''){
        this.bidSer.getScheduleNameBasedOnBidScheduleName(b_schedule_name).subscribe(
          (res)=>{
            this.allScheduleData=[]
            this.allScheduleData=res

            this.multiDimensionalUniqueForBidSchedule(res,bidSchedule)
        },
        (err)=>{console.log(err)},
        ()=>{})}
    }
    multiDimensionalUniqueForBidSchedule(data,bidSchedule) {
      var resArr = [];
      data.filter(function(item){
        var i = resArr.findIndex(x => (x.employee == item.employee ));
        if(i <= -1){
              resArr.push(item);
        }
        return null;
      });

      var emp=[]
      for(var i=0;i<resArr.length;i++){
        emp.push(Number(resArr[i].employee))
      }
      var temp={"SBP_schedule_name": bidSchedule.bid_schedule_name,
      "SBP_select_employees":emp,
      "SBP_select_qualification": "",
      "SBP_select_shiftline_schedule": [],
      "edit":true,
      "SBP_start_date": bidSchedule.schedule_start_date}
      this.localData.setItem('setUpBidScheduleOne',JSON.stringify(temp))
      this.navCtrl.navigateForward([straightlines_io_apis.apis.setUp_bid_parameters])
    }

  PopUpId
  checkClickForPopup=false
  oldPopUpId
  myFunction(i) {
    this.PopUpId=i
    this.checkClickForPopup=true
    var popupOne = document.getElementById("myPopup"+this.PopUpId);
    popupOne.style.visibility='visible'
    if(this.oldPopUpId==this.PopUpId){
        if(this.oldPopUpId!=undefined ){
          var popup = document.getElementById("myPopup"+this.oldPopUpId);
          popup.style.visibility='hidden'
        }
        this.oldPopUpId=undefined
    }else{
      if(this.oldPopUpId!=undefined  && this.PopUpId!=this.oldPopUpId){
        var oldPopup = document.getElementById("myPopup"+this.oldPopUpId);
        oldPopup.style.visibility='hidden'
      }
      this.oldPopUpId=this.PopUpId
    }
  }
  disablePopup(){

    if(this.checkClickForPopup==false){
      if(this.oldPopUpId!=undefined){
        var popupTwo = document.getElementById("myPopup"+this.oldPopUpId);
        popupTwo.style.visibility='hidden'
      }
    }
     this.checkClickForPopup=false
  }
  getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
  changeTab(e:any) {
    if (e.index == 1) {
      this.all_Bid_schedule_list = this.all_data.filter(item => item.summaryemail === null);
    } else {
      this.all_Bid_schedule_list = this.all_data.filter(item => item.summaryemail !== null);

    }
  }
}
