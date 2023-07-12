import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';

interface Roles {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss']
})
export class UpdateEmployeeComponent implements OnInit {
  allData;
  modalName;
  initalCheck
  isemailCheck
  FacilityArea;
  addEmployssSuccess
  user_data;
  addSuccess = false;
  loadFacility = false
  areaSelected
  facilityData
  facilityArea
  modal_data;
  facilityTypesName;
  allEmployee
  maximumRank
  phoneNumtoSendChild
   phoneNumberFromChild = ''
   facilitySelected
  @Output() updateData = new EventEmitter<any>();
pattarn = "[0-9]{3}-[0-9]{3}-[0-9]{4}"
  employeeForm = new FormGroup({
    area: new FormControl('', Validators.required),
    fname: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    initials: new FormControl('', Validators.required),
    facility: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', Validators.required),
    qualification: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    vacation: new FormControl('', Validators.required),
    accumulatedleave: new FormControl('', [Validators.required]),
    seniority: new FormControl(''),

  });
  area = this.employeeForm.controls['area'];
  fname = this.employeeForm.controls['fname'];
  lname = this.employeeForm.controls['lname'];
  initials = this.employeeForm.controls['initials'];
  facility = this.employeeForm.controls['facility'];
  phone = this.employeeForm.controls['phone'];
  email = this.employeeForm.controls['email'];
  qualification = this.employeeForm.controls['qualification'];
  role = this.employeeForm.controls['role'];
  vacation = this.employeeForm.controls['vacation'];
  accumulatedleave = this.employeeForm.controls['accumulatedleave'];
  seniority = this.employeeForm.controls['seniority'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>,
    private empService: EmployeeService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
  ) {
    this.modal_data = data.dataKey;
    this.modalName = data.editName;
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  }
  getAreaname(areaid){
    this.empService.getAreaName(areaid).subscribe((res) => {
      return res
    })
  }
  durations = [{ value: '8' }, { value: '9' }, { value: '10' }];

  ngOnInit(): void {
    this.store.dispatch(
      new AdminActions.GetAllEmployeesBasedOnUserId(this.user_data.id)
    );
    this.store.dispatch(new AdminActions.GetAllQualification());
    this.store.dispatch(new AdminActions.GetAllRoles());

    this.store.select('adminStore').subscribe((authdata) => {
      this.allData = authdata;
      this.facilityData = authdata.Facility
      this.facilityArea = authdata.FacilityArea
      this.initalCheck = authdata.initalCheck
      this.isemailCheck = authdata.emailCheck
      this.addEmployssSuccess = authdata.addEmployssSuccess
      if (!this.addSuccess) {
        this.addSuccess = authdata.addUpdateSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
      this.phoneNumtoSendChild = this.modal_data.phone



    });
    this.employeeForm.patchValue({
      area:this.modal_data.areaid,
      fname:this.modal_data.fname,
      lname:this.modal_data.lname,
      initials:this.modal_data.initials,
      facility:this.modal_data.facility,
      phone: this.modal_data.phone,
      email:this.modal_data.email,
      qualification:this.modal_data.qualification,
      role:this.modal_data.role,
      vacation:this.modal_data.vacation,
      accumulatedleave:this.modal_data.accumulatedleave,
      seniority:this.modal_data.rank,
    })
      this.empService.getFacilityNamesBasedOnEmpAreaId(this.modal_data.areaid).subscribe(async res => {
          await this.facilityData.find((x, index)=> {
            if(x.facilityid == res.facilityid){
              this.facilitySelected = x
              this.store.dispatch(new AdminActions.GetFacilityArea(x.facilityid));
              this.areaSelected = this.modal_data
            }})
      })

  }
  phoneFormat(phone) {
    if (phone != 0) {
      let phoneNumber = phone.replace(/[^0-9.]/g, '');
      const countryCodeStr = phoneNumber.toString().slice(0, 3);
      const areaCodeStr = phoneNumber.toString().slice(3, 6);
      const midSectionStr = phoneNumber.toString().slice(6, 10);
      return `(${countryCodeStr}) ${areaCodeStr}-${midSectionStr}`;
    } else return 'N/A';
  }
  receiveAutoMsgHandler(p) {
    this.phoneNumberFromChild = p.area+p.exchange+p.subscriber;
    this.employeeForm.patchValue({
      phone: this.phoneNumberFromChild
    })
  }
  getAreaByFacility(e){
    this.facilitySelected = e.value
    this.store.dispatch(new AdminActions.GetFacilityArea(e.value.facilityid))
  }
  getArea(e){
    this.employeeForm.patchValue({
      area: e.value
    })
  }
  checkInitialName(){
   let initial = this.employeeForm.controls.initials.value
   this.store.dispatch(new AdminActions.GetInitialCheck({managerid: this.user_data.id,initial: initial}))
  }
  emailCheck(){
   let email = this.employeeForm.controls.email.value
   this.store.dispatch(new AdminActions.GetEmailCheck({Email: email}))
  }
  async addUserShift() {
    var new_emp={
      empid: this.modal_data.empid,
      fname: this.employeeForm.controls.fname.value,
      lname: this.employeeForm.controls.lname.value,
      initials: String(this.employeeForm.controls.initials.value).toUpperCase(),
      rank: Number(this.employeeForm.controls.seniority.value),
      phone: this.employeeForm.controls.phone.value.replace(/[^0-9.]/g, ''),
      email: this.employeeForm.controls.email.value,
      qualification: this.employeeForm.controls.qualification.value,
      role: this.employeeForm.controls.role.value,
      managerid: this.user_data.id,
      vacation: this.employeeForm.controls.vacation.value,
      emailsent: 0,
      accumulatedleave: this.employeeForm.controls.accumulatedleave.value,
      areaid: this.employeeForm.controls.area.value
    }
    if(this.addEmployssSuccess && this.initalCheck != 'Initials Exist' && this.isemailCheck  != 'email exists!'){
      this.store.dispatch(new AdminActions.GetInitialCheck({managerid: this.user_data.id,initial: String(this.employeeForm.controls.initials.value).toUpperCase()}))
      this.store.dispatch(new AdminActions.GetEmailCheck({Email: this.employeeForm.controls.email.value}))
       this.updateFunction(new_emp)
    }
    else{
      this.updateFunction(new_emp)
    }
  }
  updateFunction(new_emp){
    this.empService.updateEmpBasedOnId(this.modal_data.empid,new_emp).subscribe(async res => {
      this.updateData.emit(res)
      this.massageModal(res)
    })
  }
  async massageModal(res){
    this.matDialog.closeAll();
    this.dialogRef.close(res)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'Employee Updated Successfully!',
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
  somethingChanged() {
    this.employeeForm.patchValue({
      user_shift_end_time_dom_show:
        parseInt(this.employeeForm.value.user_shift_duration) * 100 +
        +this.employeeForm.value.user_shift_start_time,
    });
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
  reset(){
    this.employeeForm.patchValue({
      area:this.modal_data.areaid,
      fname:this.modal_data.fname,
      lname:this.modal_data.lname,
      initials:this.modal_data.initials,
      facility:this.modal_data.facility,
      phone: this.modal_data.phone,
      email:this.modal_data.email,
      qualification:this.modal_data.qualification,
      role:this.modal_data.role,
      vacation:this.modal_data.vacation,
      accumulatedleave:this.modal_data.accumulatedleave,
      seniority:this.modal_data.rank,
    })
  }
}
