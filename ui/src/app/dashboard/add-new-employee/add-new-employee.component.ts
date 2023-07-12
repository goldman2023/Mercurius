import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
import { isEqual } from 'lodash';
import { EmailNotificationsService } from 'src/app/services/email-notifications/email-notifications.service';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { AddNewEmployeeService } from 'src/app/services/manage-bid-schedule/add-new-employee/add-new-employee.service';
import { QualificationService } from 'src/app/services/manage-bid-schedule/qualification/qualification.service';
import { RoleService } from 'src/app/services/manage-bid-schedule/role/role.service';
import { PhoneVerificationService } from 'src/app/services/phone-verification/phone-verification.service';
import { RegistrationService } from 'src/app/services/registration.service';
import { HeaderTitleService } from '../nav-bar-footer/header-title.service';
import { Store } from '@ngrx/store';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import * as appReducer from '../../store/app.reducers';
import * as AdminActions from '../admin/store/admin.actions';
@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss'],
})
export class AddNewEmployeeComponent implements OnInit {
all_role
  addNewEmpForm: FormGroup;
  errorMsg: any;
  isloading: boolean = false;
emailValid
phoneValid
hidePassword=true
hideConfirmPassword=true
classId=0
confirmClassId=0
  emailMessage: any;
  phoneMessage: any;
  all_qualification
  checkRankValidation=false
  user_data: any;
  checkInitial=false;
  allEmployee=[];
  maximumRank=0;
  empData
  checkEmpEdit=false
  oldinitials
  title='Add New'
  employee;
  changeMade;

constructor(public navCtrl: NavController,
    private fb:FormBuilder,
    private addNewEmp:AddNewEmployeeService,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private register:RegistrationService,
    private headerTitleService: HeaderTitleService,
    private PV:PhoneVerificationService,
    private role_name:RoleService,
    public alertController: AlertController,
    private EmailNotificationsSer:EmailNotificationsService,
    private qualifiaction_name:QualificationService,
    private store: Store<appReducer.AppState>,
    private empService: EmployeeService,
    private EV:EmailValidationService) {
      this.checkEmpEdit=navParams.get('edit')
      this.empData=navParams.get('data')

    }
    Facility
    FacilityArea
  ngOnInit() {
    // this.headerTitleService.setTitle('Add New Employee');
    // this.headerTitleService.setDefaultHeader(false)
    // this.headerTitleService.setBackUrl(straightlines_io_apis.apis.setUp_bid_parameters);
    // this.headerTitleService.setForwardUrl(null);
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    this.isloading = false;

    this.store.dispatch(new AdminActions.GetAllFacility());
    this.store.select('adminStore').subscribe((authdata) => {
      this.Facility = authdata.Facility.sort((a, b) => {
        const nameA = a.facilityname.toUpperCase();
        const nameB = b.facilityname.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.FacilityArea = authdata.FacilityArea.sort((a, b) => {
        const nameA = a.areaname.toUpperCase();
        const nameB = b.areaname.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

    })
    this.addNewEmpForm = this.fb.group({

      // phone:new FormControl('',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])),
      firstname:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(128)])),
      lastname:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(128)])),
      qualification:new FormControl('Fully Qualified',Validators.compose([Validators.required])),
      employee_initial:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2), Validators.pattern('^[_A-Za-z0-9]*$')])),
      role:new FormControl('Employee',Validators.compose([Validators.required])),
      area:new FormControl('',Validators.compose([Validators.required])),
      facility:new FormControl('',Validators.compose([Validators.required])),
      rank:new FormControl({value: '', readonly: true},Validators.compose([Validators.required,Validators.min(1), Validators.pattern('^[0-9]*$')])),
      email:new FormControl('',Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-+]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),Validators.minLength(6)])),
      vacationLeaveNumber: new FormControl('',Validators.compose([Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')])),
      accumulatedleave: new FormControl('', Validators.compose([Validators.min(0), Validators.pattern('^[0-9]*$')])),
      phone: new FormControl('', Validators.compose([Validators.pattern('(^$)|(^[0-9]{10}$)')])
      ),
    })
    this.allRole()
    this.allQualification()

    if(this.checkEmpEdit==false){
      this.title='Add New'
      this.getRank()

    }else{
      this.addNewEmp.getEmpDataBasedOnEmpId(this.empData.empId).subscribe((res)=>{
        this.employee = res;
        var roleID
    if(this.employee.role==2){
      roleID='Employee'
    }else{
      roleID='Bid Manager'
    }
    this.title='Edit'
    this.oldinitials=this.employee.initials
      this.addNewEmpForm.controls.firstname.setValue(this.employee.fname)
      this.addNewEmpForm.controls.lastname.setValue(this.employee.lname)
      this.addNewEmpForm.controls.rank.setValue(this.employee.rank)
      this.addNewEmpForm.controls.employee_initial.setValue(this.employee.initials)
      this.addNewEmpForm.controls.vacationLeaveNumber.setValue(this.employee.vacation)
      this.addNewEmpForm.controls.email.setValue(this.employee.email)
      this.addNewEmpForm.controls.role.setValue(roleID)
      this.addNewEmpForm.controls.area.setValue(this.employee.areaid)
      this.addNewEmpForm.controls.qualification.setValue(this.employee.qualification)
      this.addNewEmpForm.controls.accumulatedleave.setValue(this.employee.accumulatedleave)
      this.addNewEmpForm.controls.phone.setValue(this.employee.phone || '')
      this.compareChange();
      this.fetFacilityByAreaId(this.employee.areaid)
    },(err)=>{console.log(err)},()=>{})
    }
   
  }
  fetFacilityByAreaId(id){
    this.empService.getFacilityNamesBasedOnEmpAreaId(id).subscribe(async res => {
     this.addNewEmpForm.controls.facility.setValue(res.facilityid)
     let area = {
      value: res.facilityid
     }
     this.getAreaByFacility(area)
     this.addNewEmpForm.controls.area.setValue(id)
  })
  }
  getRank(){
    this.addNewEmp.getAllEmployeeBasedOnUserId(this.user_data.id).subscribe(
      (res)=>{this.allEmployee=res
        this.allEmployee=this.allEmployee.sort((a, b) => a.rank - b.rank)
        var tempArr=[]
        for(var i=0;i<this.allEmployee.length;i++){
          tempArr.push(this.allEmployee[i].rank)
        }

      this.maximumRank = tempArr.reduce(function(a, b) {
        return Math.max(a, b);
    }, 0);
      this.addNewEmpForm.controls.rank.setValue(this.maximumRank+ + +1)
    },
      (err)=>{console.log(err)},()=>{})
  }
  checkRank(){
    var temp=this.addNewEmpForm.value.rank

    // if(Number(this.maximumRank)<Number(temp)){
    //   this.checkRankValidation=true
    // }else{
    //   this.checkRankValidation=false
    // }

  }
  getAreaByFacility(e) {
    this.store.dispatch(new AdminActions.GetFacilityArea(e.value));
  }
allRole(){
  this.role_name.getAllRole().subscribe(
     (response)=>{
      this.all_role=response
    // return this.all_role
    },
    (err)=>{console.log(err)},()=>{
      // this.ngOnInit()

      this.addEmpForm()
    })
}
allQualification(){
  this.qualifiaction_name.getAllQualification().subscribe(
    (res)=>{this.all_qualification=res
  },
    (err)=>{console.log(err)},()=>{
      // this.ngOnInit()

      this.addEmpForm()
    })
}
addEmpForm(){

}
  get firstname(){
    return this.addNewEmpForm.get('firstname')
  }

  get lastname(){
   return this.addNewEmpForm.get('lastname')
 }

 get email(){
   return this.addNewEmpForm.get('email')
 }

 get phone() {
  return this.addNewEmpForm.get('phone');
}

 get role(){
   return this.addNewEmpForm.get('role')
 }
 get area(){
   return this.addNewEmpForm.get('area')
 }
 get facility(){
   return this.addNewEmpForm.get('facility')
 }

 get qualification(){
   return this.addNewEmpForm.get('qualification')
 }
 get employee_initial(){
  return this.addNewEmpForm.get('employee_initial')
}
get rank(){
  return this.addNewEmpForm.get('rank')
}
 get vacationLeaveNumber(){
   return this.addNewEmpForm.get('vacationLeaveNumber')
 }

 update(data){
   var emailsent
   this.isloading=true;
   if(this.empData.emailsent==0){
    emailsent=0
   }else{
    emailsent=1
   }
   var roleID=2
    if(this.addNewEmpForm.value.role=='Employee'){
      roleID=2
    }else{
      roleID=1
    }
  var update_emp={
    empid: this.empData.empId,
    fname: this.addNewEmpForm.value.firstname,
    lname: this.addNewEmpForm.value.lastname,
    initials: String(this.addNewEmpForm.value.employee_initial).toUpperCase(),
    rank: Number(this.addNewEmpForm.value.rank),
    phone: this.addNewEmpForm.value.phone,
    email: this.addNewEmpForm.value.email,
    qualification: this.addNewEmpForm.value.qualification,
    role: roleID,
    managerid: this.user_data.id,
    vacation: this.addNewEmpForm.value.vacationLeaveNumber,
    emailsent: emailsent,
    accumulatedleave: this.addNewEmpForm.value.accumulatedleave,
    areaid: this.addNewEmpForm.value.area,
    status: this.empData.status
  }

  this.addNewEmp.updateEmpBasedOnId(this.empData.empId,update_emp).subscribe(async (res)=>{
    this.isloading = false;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'Updated Successfully!',
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
  },async (err)=>{console.log(err);
    this.isloading = false;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: 'Please try again!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.modalCtrl.dismiss()
          }
        }
      ]
    });

    await alert.present();},()=>{

  })
 }

  compareChange() {
    let newResponse = {
      empid: this.employee?.empid || null,
      fname: this.addNewEmpForm.value.firstname,
      lname: this.addNewEmpForm.value.lastname,
      initials: String(this.addNewEmpForm.value.employee_initial).toUpperCase(),
      phone: parseInt(this.addNewEmpForm.value.phone || 0),
      email: this.addNewEmpForm.value.email,
      qualification: this.addNewEmpForm.value.qualification,
      role: this.addNewEmpForm.value.role === 'Employee' ? 2 : 1,
      managerid: this.user_data.id,
      rank: Number(this.addNewEmpForm.value.rank),
      vacation: this.addNewEmpForm.value.vacationLeaveNumber,
      accumulatedleave: this.addNewEmpForm.value.accumulatedleave || null,
      emailsent: this.employee?.emailsent || false,
      status: this.employee?.status || 1,
      areaid:  this.addNewEmpForm.value.area
    }
    this.changeMade = isEqual(JSON.stringify(newResponse), JSON.stringify(this.employee));
  }

  async onSubmit(data){
    this.isloading = true;
    var roleID=2
    if(this.addNewEmpForm.value.role=='Employee'){
      roleID=2
    }else{
      roleID=1
    }
    var new_emp={
      fname: this.addNewEmpForm.value.firstname,
      lname: this.addNewEmpForm.value.lastname,
      areaid: this.addNewEmpForm.value.area,
      initials: String(this.addNewEmpForm.value.employee_initial).toUpperCase(),
      rank: Number(this.addNewEmpForm.value.rank),
      phone: this.addNewEmpForm.value.phone,
      email: this.addNewEmpForm.value.email,
      qualification: this.addNewEmpForm.value.qualification,
      role: roleID,
      managerid: this.user_data.id,
      vacation: this.addNewEmpForm.value.vacationLeaveNumber,
      emailsent: 0,
      accumulatedleave: this.addNewEmpForm.value.accumulatedleave
    }

    this.addNewEmp.addNewEmployee(new_emp).subscribe(
      async (response)=>{

        this.EmailNotificationsSer.whenNewEmployeesAreAddedByTheBidManager(this.user_data.id).subscribe(async (res)=>{
          this.addNewEmpForm.reset()
          this.ngOnInit()
          this.isloading = false;
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Success',
            message: 'Added Successfully!',
            buttons: [
              {
                text: 'Ok',
                handler: async () => {

                  const alertC = await this.alertController.create({
                    cssClass: 'my-custom-class',
                    message: 'Do you want to add more Employees?',
                    buttons: [
                      {
                        text: 'No',
                        handler: () => {
                          this.modalCtrl.dismiss()
                          // this.navCtrl.navigateForward([straightlines_io_apis.apis.setUp_bid_parameters])
                        }
                      }, {
                        text: 'Yes',
                        role: 'cancel',
                        handler: () => {

                        }
                      }
                    ]
                  });

                  await alertC.present();
                }
              }
            ]
          });

          await alert.present();
        },async (err)=>{console.log(err);
          this.isloading = false;
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Error',
            message: 'Please try again!',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.modalCtrl.dismiss()
                }
              }
            ]
          });

          await alert.present();},()=>{})


     },
     (err)=>{console.log(err)},()=>{
      this.isloading = false;
     })
  }

  changePhoneValue() {
    if (
      this.addNewEmpForm.value.phone == null ||
      this.addNewEmpForm.value.phone == ''
    ) {
      return (this.phoneValid = false);
    }
  }

  checkInitialName(){
    var initial
    initial=this.addNewEmpForm.value.employee_initial
    if((this.oldinitials!=initial && initial!=null) ||( this.empData.empInitial!=initial && initial!=null)){
    this.addNewEmp.checkEmpIsExistOrNot(this.user_data.id,initial).subscribe(
      (response)=>{

       if(String(response['message'])=='Initials Exist')
       {this.checkInitial=true}
       else{
        this.checkInitial=false
       }
     // return this.all_role
     },
     (err)=>{console.log(err)},()=>{
       // this.ngOnInit()
     })
    }
  }
  
  initialName(){
    this.checkInitial=false
  }
  close(){
    this.modalCtrl.dismiss()
  }
}
