import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { HeaderTitleService } from '../../nav-bar-footer/header-title.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { MyBiddingService } from './my-bidding.service';
import { BidScheduleService } from 'src/app/services/manage-bid-schedule/bid-schedule/bid-schedule.service';
import { ViewBidWindowComponent } from './view-bid-window/view-bid-window.component';
import { MyBiddingStepOneShiftLineComponent } from './my-bidding-step-one-shift-line/my-bidding-step-one-shift-line.component';
import { BidShiftlinesService } from 'src/app/services/manage-bid-schedule/create-new-bid-schedule/bid-shiftlines.service';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-my-bidding-dashboard',
  templateUrl: './my-bidding-dashboard.component.html',
  styleUrls: ['./my-bidding-dashboard.component.scss'],
})
export class MyBiddingDashboardComponent implements OnInit {
  @ViewChild(MyBiddingStepOneShiftLineComponent) child: MyBiddingStepOneShiftLineComponent;
  schedule_id: number=0;
  activeroundId=0
  step_form_name
  screen_id=0
  user_data: any;
  bid_schedule_name='select bid schedule name'
  selectedShiftLines=[]
  slideOption={
    shortSwipes:true,
    longSwipes:true,
    longSwipesRatio:0.5,
    initialSlide: 0,
    slidesPerView: 2.4,
    spaceBetween: 0,
    centeredSlides:false,
    loop:true,
    zoom: false,
   }
   managerIds=[]
  screen_root_id = 1
  permission_action_names: {
    linkName:string,
    actionName:string
  }[] = [{
    linkName: 'Seniority List',
    actionName: 'View Seniority List'
  }, 
  {
    linkName: 'Bid Windows',
    actionName: 'View Bid Windows'
  },
  {
    linkName: 'Shiftlines Bid',
    actionName: 'Shiftlines Bid'
  },
  {
    linkName: 'Leave Bid',
    actionName: 'Leave Bid'
  },
  {
    linkName: 'Schedule-Leave',
    actionName: 'Schedule-Leave'
  }
  ];
  view_apis: string[] = [
    'view_seniority_list', 'view_bid_window', 'view_bid_schedule', 'view_leave_bid', 'view_schedule_leave_summary'
  ];
  employee_view_apis: string[] = [
    'employee_view_seniority_list', 'employee_view_bid_window', 'employee_view_bidschedule', 'employee_view_leave_bid', 'employee_view_schedule_leave_summary'
  ];
  constructor(public navCtrl: NavController,
    private myBiddingSer:MyBiddingService,
    public alertCtrl: AlertController,
    public alertController: AlertController,
    private cdref: ChangeDetectorRef,
    private bidShiftLineSer:BidShiftlinesService,
    private bidSer:BidScheduleService,
    private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('My Bidding');
    this.headerTitleService.setDefaultHeader(true)
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.bidding);
      this.headerTitleService.setForwardUrl(null);this.headerTitleService.checkBiddingTime('biddingheader')
      this.user_data=JSON.parse(sessionStorage.getItem('userData'))
      this.managerIds.push(this.user_data.id)
      if(this.user_data.managerId!=null && this.user_data.managerId!=undefined){
        this.managerIds.push(this.user_data.managerId)
      }
      this.headerTitleService.setBackUrl(this.user_data.role==='emp' ? null : straightlines_io_apis.apis.my_bidding);
      this.myBiddingSer.title.subscribe(title => {
        this.step_form_name = title;
        // if(this.step_form_name=='step-1'){
        //   this.getColor()
        // }
        // if(this.step_form_name=='step-2'){
        //   this.getIndicatorClassOne()
        // }
        // if(this.step_form_name=='step-3'){
        //   this.getIndicatorClass()
        // }

        if(this.step_form_name=='seniorityList'){
          this.screen_id=1
        }
        else if(this.step_form_name=='viewBidWindow'){
          this.screen_id=2
        }
        else if(this.step_form_name=='viewBidShiftLine'){
          this.screen_id=3
        }else if(this.step_form_name=='viewLeaveBid'){
          this.screen_id=4
        }else if(this.step_form_name=='viewScheduleLeaveSummary'){
          this.screen_id=5
        }
        else{
          this.screen_id=0
        }

      });

      }
      ngAfterContentChecked() {
        this.cdref.detectChanges();
      }

      ionViewWillEnter(){
        this.cdref.detectChanges();
      }
      getColor(){
        return 'active ';
      }

      getIndicatorClassOne(){

           if(this.step_form_name=='step-2'){
            return 'active ';

          }
          else if(this.step_form_name=='step-3'){
            return 'active';
          }
          return'small'
      }
      getIndicatorClass(){
        if(this.step_form_name=='step-3'){
          return this.getIndicatorClassOne();
        }
        return'small'
    }
    myBidding(){
      this.navCtrl.navigateBack([straightlines_io_apis.apis.my_bidding])
    }
    
    manageBidSchedul(){
      this.getUnderlineClassRoot(1)
      if(this.user_data.role==='bidmanager' ){
      this.navCtrl.navigateForward([straightlines_io_apis.apis.manage_bid_schedule])
      }
    }
    home(){
      this.getUnderlineClassRoot(1)
      this.screen_root_id=1
      if(this.user_data.empid!==undefined){
        this.navCtrl.navigateForward([straightlines_io_apis.apis.my_bidding])
        }
    }
    manageBidSchedule(){
      this.getUnderlineClassRoot(2)
      this.screen_root_id=2
      if(this.user_data.role==='bidmanager'){
      this.bidSer.getAllBidSchedule(this.user_data.id).subscribe((res)=>{
        if(res.length<1 || res==null || res==undefined){
          this.navCtrl.navigateForward([straightlines_io_apis.apis.setUp_bid_parameters])
        }else{
          this.navCtrl.navigateForward([straightlines_io_apis.apis.manage_bid_schedule])
        }


       },async (err)=>{
         console.log(err)
         const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Error',

          message: 'Please try again later.',
          buttons: ['Ok']
        });

        await alert.present();


       },()=>{})
      }
    }

    doSomething(e){
    }

    onActivate(componentReference) {
      componentReference.passBidScheduleName.subscribe((data) => {
        this.bid_schedule_name=data
     })
     componentReference.passroundId.subscribe((data) => {
      this.activeroundId=data
   })
    }
  
  getClass(id) {
    let status = this.getPermissionActionName(this.permission_action_names[id - 1].actionName) ? '' : ' disabled';
    if(this.screen_id == id){
      return 'font-size-14px font-bold app-font-primary-color ion-underline cursor-pointer' + status;
    }else{
      return 'font-size-14px cursor-pointer' + status;
    }
  }

  viewList(id) {
    if(this.user_data.role==='bidmanager' || this.user_data.role == 'emp'){
      this.navCtrl.navigateForward([straightlines_io_apis.apis[this.view_apis[id]]+'/'+this.bid_schedule_name+'/'+this.activeroundId])
    }else{
      this.navCtrl.navigateForward([straightlines_io_apis.apis[this.employee_view_apis[id]]+'/'+this.bid_schedule_name+'/'+this.activeroundId])
    }
  }

  //  getUnderlineClass(id){
  //   if(this.screen_id==id){
  //     return 'font-size-14px font-bold   app-font-primary-color ion-underline'
  //   }else{
  //     return 'font-size-14px '
  //   }
  //  }
   getUnderlineClassRoot(id){
    if(this.screen_root_id==id){
      return 'app-font-mercurius-secondary-color ion-underline-p'
    }else{
      return 'disable-color'
    }
   }
   getPermissionActionName(actionName){
    return this.user_data.permissionDetails.some(element => element.actionName === actionName);
  }
}
