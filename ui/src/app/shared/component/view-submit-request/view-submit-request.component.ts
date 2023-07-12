import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import moment from 'moment';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { UpdateEmployeeComponent } from 'src/app/dashboard/admin/components/employees/update-employee/update-employee.component';
import { ScrollService } from 'src/app/dashboard/employee-information/scroll.service';
import { ServiceService } from 'src/app/dashboard/employee-information/service.service';
import { RequestInboxComponent } from 'src/app/dashboard/request-inbox/request-inbox.component';

@Component({
  selector: 'app-view-submit-request',
  templateUrl: './view-submit-request.component.html',
  styleUrls: ['./view-submit-request.component.scss']
})
export class ViewSubmitRequestComponent implements OnInit {
  showContextDataForm
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
action
user_data

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
    deny_reason: new FormControl('')
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public showContextData: RequestInboxComponent,
    public manageSchedule: ManageScheduleService,
    public employeeService: EmployeeService,
    private scrollService: ScrollService,
    private route: ActivatedRoute,
    public serviceService: ServiceService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    ) { }

  ngOnInit(): void {

    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.showContextDataForm = this.showContextData.data
    this.action = this.showContextData.action
    this.submitRequestForm.patchValue({
      employee_name: `${this.showContextDataForm.empLname}, ${this.showContextDataForm.empFname}`,
      request_type: this.showContextDataForm.requestType,
      sick_leave_purposes: this.showContextDataForm.requestPurpose,
      Is_fmla: this.showContextDataForm.fmlaStatus,
      change_from: this.showContextDataForm.shiftChangeFromDate,
      change_to_date: this.showContextDataForm.shiftChangeToDate,
      change_to: this.showContextDataForm.shiftTimeChangeTo,
      change_shift: this.showContextDataForm.shiftTimeChangeFrom,
      fmla_purposes: this.showContextDataForm.fmlaPurpose,
      start_date: this.showContextDataForm.leaveStartDate,
      bid_manager: this.showContextDataForm.bidManagerId,
      end_date: this.showContextDataForm.leaveEndDate,
      start_time: this.showContextDataForm.leaveStartTime,
      end_time: this.showContextDataForm.leaveEndTime,
      remarks: this.showContextDataForm.remarks,
      deny_reason: this.showContextDataForm.denialReason
    })
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

  submitData = {}
  submitRequest(action){
      let submitData = {
          ...this.showContextDataForm,
          status: action,
        denialReason: this.submitRequestForm.controls.deny_reason.value,
        requestUpdatedBy: this.user_data.id,
        requestUpdatedDate: moment(new Date()).format('YYYY-MM-DD')
      }
      this.callSubmitService(submitData, action)
  }

  callSubmitService(data, action){
    this.employeeService.leaveRequestUpdate(data, data.requestId).subscribe(res => {
      this.massageModal(res, action)
    }, (errr) => {
    }, ()=> {})
  }

  async massageModal(res, action){
    this.matDialog.closeAll();
    this.dialogRef.close(res)
    let message
    if(action == 'Approved'){
      message = 'Submit Request Successfully Approved!'
    }
    if(action == 'Denied'){
      message = 'Submit Request Is Not Approved!'
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: message,
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
 
}
