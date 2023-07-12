import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import moment from 'moment';
import { element } from 'protractor';
import { UpdateEmployeeComponent } from 'src/app/dashboard/admin/components/employees/update-employee/update-employee.component';
import { ScrollService } from 'src/app/dashboard/employee-information/scroll.service';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';
import { DailyScheduleComponent } from 'src/app/dashboard/manage-schedules/basic-watch-schedule/daily-schedule/daily-schedule.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { WeeklyScheduleComponent } from '../../basic-watch-schedule/weekly-schedule/weekly-schedule.component';
import { ScheduleComponent } from 'src/app/shared/component/schedule/schedule.component';
interface Roles {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-submit-request-modal',
  templateUrl: './submit-request-modal.component.html',
  styleUrls: ['./submit-request-modal.component.scss']
})
export class SubmitRequestModalComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  empid;
  bischid;
  Bidparamesget: any = [];
  allEmployees: any = [];
  presentEmployee;
  empData;
  currentSection 
  allShifts
  minDate = new Date();
  submitRequestForm = new FormGroup({
    employee_name: new FormControl('', Validators.required),
    request_type: new FormControl('', Validators.required),
    sick_leave_purposes: new FormControl(''),
    Is_fmla: new FormControl(''),
    change_from: new FormControl(''),
    change_to_date: new FormControl(''),
    change_to: new FormControl(''),
    change_shift: new FormControl(''),
    Is_fmla2: new FormControl(''),
    fmla_purposes: new FormControl(''),
    start_date: new FormControl(''),
    bid_manager: new FormControl(''),
    end_date: new FormControl(''),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
    remarks: new FormControl(''),
  })
  empdata: any
  startDateData
  startDateDatavl = false
  endDateDatavl = false
  EndDateData
  user_data
  constructor(public scheduleComponent: ServiceService,
    @Inject(MAT_DIALOG_DATA) public fullEmpDetails: ScheduleComponent,
    public manageSchedule: ManageScheduleService,
    public employeeService: EmployeeService,
    public serviceService: ServiceService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,) { }

  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    const startDate = new Date();
    this.maxStartDate = moment(startDate).add(120, 'days').toDate();
    this.submitRequestForm.patchValue({
      request_type: 'Annual Leave'
    })
  
     if(this.fullEmpDetails){
      this.empdata = this.fullEmpDetails
        if(this.fullEmpDetails.takenDate){
          if(this.submitRequestForm.controls.request_type.value == 'Shift Change'){
            this.submitRequestForm.patchValue({
              change_from: this.fullEmpDetails.takenDate
             })
          }else{
            this.submitRequestForm.patchValue({
              start_date: this.fullEmpDetails.takenDate,
             })
          }
          
        }
     }

     this.employeeService.getWorksheet(this.empdata.bidScheduleId, this.empdata.empid).subscribe(res => { 
       this.allShifts = res
      })
      // this.employeeChanges()
      this.getEmployeeListByBidScheduleID()
  }
  getEmployeeListByBidScheduleID() {
     
  
   
    if(this.fullEmpDetails){
       
      this.empdata = this.fullEmpDetails
        if(this.fullEmpDetails.takenDate){
          this.submitRequestForm.patchValue({
           start_date: this.fullEmpDetails.takenDate,
           change_from: this.fullEmpDetails.takenDate
          })
        }
       
       this.changeDate() 
       this.startDateSeclectionChange()
     }
     this.presentEmployee = this.empdata
    this.submitRequestForm.patchValue({
      employee_name: this.presentEmployee.empid
    })
    this.allEmployees = [];
    this.manageSchedule
      .GetBidParamgetAllEmpIdBasedonBidschId(
        this.empdata.bidScheduleId
      )
      .subscribe((res) => {
        this.Bidparamesget = res;
        this.allEmployees = res
        this.employeeChanges()
      });
  }
  Roles: Array<Roles> = [
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
  ];

 
   submitData = {}
  submitRequest(){
    let duration = 0
    let bidscheduleid = ''
   
    if(this.fullEmpDetails){
      duration = this.fullEmpDetails.duration
      bidscheduleid = this.fullEmpDetails.bidScheduleID
    }
   
    this.submitData = {}
    let emp = this.allEmployees.find(element => element.empid === this.submitRequestForm.controls.employee_name.value);
    let startTime = null
    let endTime = null
    if(this.submitRequestForm.controls.start_time.value){
      startTime = this.submitRequestForm.controls.start_time.value + ':00'
    }
    if(this.submitRequestForm.controls.end_time.value){
      endTime = this.submitRequestForm.controls.end_time.value + ':00'
    }
    if(this.submitRequestForm.controls.request_type.value != 'Sick Leave'){
      this.submitRequestForm.patchValue({
        requestPurpose: '',
        fmlaStatus: false,
        fmlaPurpose: ''
      })

    }
    if(this.submitRequestForm.controls.request_type.value == 'Shift Change'){
      let submitData = {
        empId: this.submitRequestForm.controls.employee_name.value,
        requestType: this.submitRequestForm.controls.request_type.value,
        requestPurpose: '',
        fmlaStatus:  false,
        shiftTimeChangeTo:  this.formatDate24(this.submitRequestForm.controls.change_to.value.shiftTime),
        shiftTimeChangeFrom:  this.formatDate24(this.changeFrom),
        shiftChangeFromDate:  moment(this.submitRequestForm.controls.change_from.value).format('YYYY-MM-DD'),
        shiftChangeToDate:  moment(this.submitRequestForm.controls.change_to_date.value).format('YYYY-MM-DD'),
        fmlaPurpose: '',
        leaveStartDate: '',
        leaveEndDate: '',
        starttime :'' ,
        endtime: '',
        bidschIdRef:this.empdata.bidScheduleId,
        requestSubmittedDate: moment(new Date()).format('YYYY-MM-DD'),
        bidManagerId: this.bid_manager.bidManagerId,
        remarks: this.submitRequestForm.controls.remarks.value,
        duration: duration, 
        status: 'Pending'
      }
      this.callSubmitService(submitData)
    }
    else if(this.submitRequestForm.controls.request_type.value == 'Sick Leave'){
      let submitData = {
        empId: this.submitRequestForm.controls.employee_name.value,
        requestType: this.submitRequestForm.controls.request_type.value,
        requestPurpose: this.submitRequestForm.controls.sick_leave_purposes.value,
        fmlaStatus:  this.submitRequestForm.controls.Is_fmla.value,
        fmlaPurpose: this.submitRequestForm.controls.fmla_purposes.value,
        leaveStartDate: moment(this.submitRequestForm.controls.start_date.value).format('YYYY-MM-DD'),
        leaveEndDate: moment(this.submitRequestForm.controls.end_date.value).format('YYYY-MM-DD'),
        leaveStartTime :startTime ,
        bidschIdRef:this.empdata.bidScheduleId,
        leaveEndTime: endTime,
        requestSubmittedDate: moment(new Date()).format('YYYY-MM-DD'),
        bidManagerId: this.bid_manager.bidManagerId,
        remarks: this.submitRequestForm.controls.remarks.value,
        duration: duration, 
        status: 'Pending'
      }
      this.callSubmitService(submitData)
    }else{
      let submitData = {
        empId: this.submitRequestForm.controls.employee_name.value,
        requestType: this.submitRequestForm.controls.request_type.value,
        bidschIdRef:this.empdata.bidScheduleId,
        // fmlaStatus:  this.submitRequestForm.controls.Is_fmla.value,
        // fmlaPurpose: this.submitRequestForm.controls.fmla_purposes.value,
        leaveStartDate: moment(this.submitRequestForm.controls.start_date.value).format('YYYY-MM-DD'),
        leaveEndDate: moment(this.submitRequestForm.controls.end_date.value).format('YYYY-MM-DD'),
        starttime :startTime ,
        endtime: endTime,
        requestSubmittedDate: moment(new Date()).format('YYYY-MM-DD'),
        bidManagerId: this.bid_manager.bidManagerId,
        remarks: this.submitRequestForm.controls.remarks.value,
        duration: duration, 
        status: 'Pending'
      }
      this.callSubmitService(submitData)
    }
    
  }

  callSubmitService(data){
    this.employeeService.leaveRequestSave(data).subscribe(res => {
      this.massageModal(res)
    }, (errr) => {
    }, ()=> {})
  }

  somethingChanged(){
   this.changeTO = []
    this.submitRequestForm.patchValue({
      sick_leave_purposes: '',
      Is_fmla: '',
      change_from: '',
      change_to_date: '',
      change_to: '',
      change_shift: '',
      Is_fmla2: '',
      fmla_purposes: '',
      start_date: '',
      bid_manager: '',
      end_date: '',
      start_time: '',
      end_time: '',
    })
    if(this.fullEmpDetails.takenDate){
      this.submitRequestForm.patchValue({
       start_date: this.fullEmpDetails.takenDate,
       change_from: this.fullEmpDetails.takenDate
      })
    }
    this.startDateDatavl = false
    this.startDateData = null
    this.startDateRange = null
     this.endDateRange = null
     this.EndDateData = null
     if(this.submitRequestForm.controls.request_type.value == 'Shift Change'){
      if(this.fullEmpDetails.takenDate){
        this.submitRequestForm.patchValue({
         change_from: this.fullEmpDetails.takenDate
        })
      }
      this.changeDate() 
    }else{
      if(this.fullEmpDetails.takenDate){
      this.submitRequestForm.patchValue({
       start_date: this.fullEmpDetails.takenDate,
      })
    }
      this.startDateSeclectionChange()
    }
  }
  maxStartDate: Date = new Date();
  startDateRange
  endDateRange

  dateChangeEvent: any = []
  changeFrom
  shift
  changeDate(){
    this.dateChangeEvent = []
    this.employeeService.getWorksheet(this.empdata.bidScheduleId, this.empdata.empid).subscribe(res => { 
      this.shift = ''
      res.shiftInfo.filter(res2 => {
        if(moment(res2.date).format('DD-MM-YYYY') == moment(this.submitRequestForm.controls.change_from.value).format('DD-MM-YYYY')){
        if(res2.rdoDayOff){
          this.changeFrom = res2.time
         this.shift = "RDO"
          this.submitRequestForm.patchValue({
            change_shift: this.shift
          })
          this.dateChangeEvent.push(this.shift)

        }else{
          this.changeFrom = res2.time
          this.shift = `${this.formatDate(res2.time)} - ${ this.formatDate((res2.time + (res2.duration * 100)))}`
           this.submitRequestForm.patchValue({
             change_shift: this.shift
           })
           this.dateChangeEvent.push(this.shift)
        }
        
      }
    })
  })
  }
 
  changeTO : any =[]
  shiftTo
  changeTo(){
    this.employeeService.getWorksheet(this.empdata.bidScheduleId, this.empdata.empid).subscribe(res => { 
      this.shiftTo = ''
      res.shiftInfo.filter(res2 => {
        if(moment(res2.date).format('DD-MM-YYYY') == moment(this.submitRequestForm.controls.change_to_date.value).format('DD-MM-YYYY')){
        if(res2.rdoDayOff){
         this.shiftTo = "RDO"
        }
      }
    })
    })
    this.getAllBidSchedule(moment(this.submitRequestForm.controls.change_to_date.value).format('YYYY-MM_DD'));
  }
  startDateSeclectionChange(){
    this.employeeService.getWorksheet(this.empdata?.bidScheduleId, this.empdata.empid).subscribe(res => { 
      this.allShifts = res
      this.allShifts.shiftInfo.filter(res => {
        if(res.date == moment(this.submitRequestForm.controls.start_date.value).format('YYYY-MM-DD')){
          if(res.rdoDayOff){
            this.startDateDatavl = false
            this.startDateData = 'RDO'
            this.startDateRange = null
             this.endDateRange = null
          }else{
            this.startDateData =  `${this.formatDate(res.time.toString().padStart(4, '0'))} - ${this.formatDate((+res.time.toString().padStart(4, '0') + +(res.duration * 100).toString().padStart(4, '0')))}`
            this.startDateDatavl = false
            this.startDateRange = null
            this.endDateRange = null
          }
        }
      })
      this.allShifts.vacationInfo.forEach(element => {
        if(element.vacationStartDate == moment(this.submitRequestForm.controls.start_date.value).format('YYYY-MM-DD')){
          this.startDateData = `VL ${moment(element.vacationStartDate).format('MM-DD-YYYY')} - ${moment(element.vacationEndDate).format('MM-DD-YYYY')}`;
          this.startDateDatavl = true
          this.startDateRange = moment(element.vacationStartDate).format('MM-DD-YYYY')
          this.endDateRange = moment(element.vacationEndDate).format('MM-DD-YYYY')
        }
      });
    })
   
   
  }
  formatDateNormal(timeStr): string {
    let time = parseInt(timeStr);
  if (time >= 2400) {
    time -= 2400;
  }
   
    return time.toString().padStart(4,'0');
  }
  formatDate(timeStr): string {
    let time = parseInt(timeStr);
    if (time >= 2400) {
      time -= 2400;
    }
    let hour = Math.floor(time / 100);
    let minute = time % 100;
    let amPm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    let formattedTime = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0') + ' ' + amPm;
    return formattedTime;
  }
  formatDate24(timeStr: string): string {
    let time = parseInt(timeStr, 10);
    if (time >= 2400) {
      time -= 2400;
    }
    let hour = Math.floor(time / 100);
    let minute = time % 100;
    hour = hour % 24;
    let formattedTime = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0') + ':00';
    return formattedTime;
  }
    
  endDateSeclectionChange(){
    if( moment(this.submitRequestForm.controls.end_date.value).format('MM-DD-YYYY') >= this.startDateRange && moment(this.submitRequestForm.controls.end_date.value).format('MM-DD-YYYY') <= this.endDateRange){
      this.isWithinDateRange(moment(this.submitRequestForm.controls.end_date.value).format('MM-DD-YYYY'))
    }else{
      this.employeeService.getWorksheet(this.empdata.bidScheduleId, this.empdata.empid).subscribe(res => { 
        this.allShifts = res
        this.allShifts.shiftInfo.filter(res => {
          if(res.date == moment(this.submitRequestForm.controls.end_date.value).format('YYYY-MM-DD')){
            if(res.rdoDayOff){
              this.EndDateData = 'RDO' 
              this.endDateDatavl = false
            }else{
              this.EndDateData =  `${this.formatDate(res.time.toString().padStart(4, '0'))} - ${this.formatDate((+res.time.toString().padStart(4, '0') + +(res.duration * 100).toString().padStart(4, '0')))}`
              this.endDateDatavl = false
            }
          }
        })
        this.allShifts.vacationInfo.forEach(element => {
          if(element.vacationStartDate == moment(this.submitRequestForm.controls.end_date.value).format('YYYY-MM-DD')){
            this.EndDateData =`VL ${moment(element.vacationStartDate).format('MM-DD-YYYY')} - ${moment(element.vacationEndDate).format('MM-DD-YYYY')}`;
            this.endDateDatavl = true
          }
        });
      })
    }
   
  }

async massageModal(res){
  this.matDialog.closeAll();
  this.dialogRef.close(res)
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Success',
    message: 'Submit Request  Successfully Added!',
    buttons: [
      {
        text: 'Ok',
        handler: () => {
          this.modalCtrl.dismiss()
        }
      }
    ]
  });

  await alert.present();
}

isWithinDateRange(today) {
 
  const startDate = this.startDateRange;
  const endDate = this.endDateRange;
  if( today >= startDate && today <= endDate){
    this.EndDateData =`VL ${moment(this.startDateRange).format('MM-DD-YYYY')} - ${moment(this.endDateRange).format('MM-DD-YYYY')}`;
        this.endDateDatavl = true
  }
}

bidScheduleService(data) {
  let dayName = moment(this.submitRequestForm.controls.change_to_date.value).format('dddd').substring(0, 3);
  this.manageSchedule
    .getWorkForceBasedOnShiftLineScheduleDayAndId(
      dayName,
      data?.shiftdefmap[0].shiftdefref
    )
    .subscribe(
      (res2) => {
        this.changeTO = res2
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
}

getAllBidSchedule(date) {
  this.manageSchedule.bidScheduleList(this.user_data.id, 'posted').subscribe(
    (res) => {
      res.filter(res2 => {
        if(res2.bidschid == this.empdata.bidScheduleId){
          this.bidScheduleService(
            res2
          );
        
        }
      })
       },
    (err) => {
      console.log(err);
    },
    () => {}
  );
}

balance = null
bid_manager
employeeChanges(){
  this.allEmployees.filter(res => {
    if(res.empid == this.submitRequestForm.controls.employee_name.value){
      this.balance = res
      let empdata = {
        ...res,
        bidScheduleId: this.empdata.bidScheduleId,
      }
      this.empdata = empdata
      this.employeeService.getManagerdetailsOfAnEmployee(res.empid).subscribe(res => {
        this.bid_manager = res
      })
    }
  })
}
}
