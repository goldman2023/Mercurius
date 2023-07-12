import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { AssingscheduleService } from 'src/app/services/assignschedule/assingschedule.service';
import { BidParamPost, BiddingPostMore } from '../assign-schedules.interface';
import moment from 'moment';
import Swal from 'sweetalert2';
import straightlines_io_apis from 'src/app/json/apis.json';

@Component({
  selector: 'app-save-assign-schedules-modal',
  templateUrl: './save-assign-schedules-modal.component.html',
  styleUrls: ['./save-assign-schedules-modal.component.scss']
})
export class SaveAssignSchedulesModalComponent implements OnInit {

  scheduleNameForm = new FormGroup({
    schedule_name: new FormControl()
  });
  assignScheduleData;
  dateRange;
  scheduleName;
  bidParamPost: BidParamPost;
  biddingPostMore: BiddingPostMore[] = [];
  status=''
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public assignScheduleService:AssingscheduleService
  ) { 
    this.assignScheduleData = navParams.get('assignScheduleData')
    this.dateRange = navParams.get('dateRange')
    this.scheduleName = navParams.get('scheduleName')
  }

  ngOnInit(): void {
  }

  get schedule_name(){
    return this.scheduleNameForm.get('schedule_name')
  }
  close() {
      this.modalCtrl.dismiss()
  }
  async addNewShiftlineSchedule() {
    try {
      var user_data = JSON.parse(sessionStorage.getItem('userData'));
      const response = await this.assignScheduleService.checkBidScheduleName(this.schedule_name.value, user_data.id).toPromise();
      if (response.message.includes("unique")) {
        this.bidParamPost = {
          bidschename: this.schedule_name.value,
          bidmanagerid: user_data.id,
          bidroundoption: 0,
          bidschenddate: moment(Date.now()).format("YYYY-MM-DD"),
          bidschstartdate: moment(Date.now()).format("YYYY-MM-DD"),
          schedulesavestatus: 0,
          leavemap: [],
          roundmap: [],
          roundsavestatus: 0,
          totalbidleaves: 0,
          totalbidrounds: 0,
          weekendstatus: 0,
          timezone: 'US/Eastern',
          summaryemail: null,
          intervalduration: null,
          intervalstarttime: null,
          hasinterval: false,
          bwsStatus: null,
          status: 'Shifts Assigned',
          shiftdefmap: [{ shiftdefref: this.assignScheduleData[0][1].shidref, shiftdefenddate: moment(this.dateRange.end).format("YYYY-MM-DD"), shiftdefstartdate: moment(this.dateRange.start).format("YYYY-MM-DD") }],
          employeemap: this.assignScheduleData.map(item => ({ empidref: item[0].empid, employeebidstatus: null })),
          leavesavestatus:0
        }
        const { bidschid, bidschename } = await this.assignScheduleService.creatBidParamPost(this.bidParamPost).toPromise();
        
        for (let i = 0; i < this.assignScheduleData.length; i++) {
          const element = this.assignScheduleData[i];
          this.biddingPostMore.push({
            bidstatus: "Completed",                       
            windowstatus: "Completed",                    
            empwindowduration: null,
            empwindowstartdateandtime: "",
            bidschidref: bidschid,		                
            bidschename: bidschename,                    
            empidref: element[0].empid,			            
            initials: element[0].initials,		               
            roundseq_id: 1,	                    
            shiftidref: element[1].shidref,		                
            schedulename: this.scheduleName,                    
            shiftseq_id: element[1].seq_id,                     
            shiftname: element[1].shiftname,		                
            pattern: element[1].pattern,		                    
            shiftlineidref: element[1].sh_line_id

          })
        }
        const res = await this.assignScheduleService.createBiddingPostMore(this.biddingPostMore).toPromise()
        this.showSuccessAlert(bidschename,'saved', () => {
          this.close()
          this.navCtrl.navigateForward([
            straightlines_io_apis.apis.manage_bid_schedule,
          ]);
       })
        // this.close()
      } else {
        this.status = response.message
      }
      
    } catch (error) {
      console.log('error==', error);
      this.close()
    }
  }
  showSuccessAlert(title:string,type: string, callback: () => void) {
    Swal.fire({
      title: 'Success!',
      html: `"${title}" AssignSchedule was ${type} successfully!`,
      icon: 'success',
      showCancelButton: false,
      imageHeight: '250px',
      heightAuto: false,
      confirmButtonColor: '#ff6700',
      timer: 2500,
    }).then(callback);
  }
}
