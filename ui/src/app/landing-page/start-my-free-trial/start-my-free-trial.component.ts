import { Component, OnInit } from '@angular/core';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { RegistrationService } from 'src/app/services/registration.service';
import Swal from 'sweetalert2';
import { PhoneVerificationService } from 'src/app/services/phone-verification/phone-verification.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RequestDemoService } from 'src/app/services/request-demo/request-demo.service';
import { TrialPeriodService } from 'src/app/services/trial-period.service';
@Component({
  selector: 'app-start-my-free-trial',
  templateUrl: './start-my-free-trial.component.html',
  styleUrls: ['./start-my-free-trial.component.scss'],
})
export class StartMyFreeTrialComponent implements OnInit {
  registrationForm: FormGroup;
  errorMsg: any;
  emailValid
  phoneValid
  empUser
  empFname
  empLname
  checkEmployee=false
  hidePassword=true
  hideConfirmPassword=true
  classId=0
  confirmClassId=0
  emailMessage: any;
  phoneMessage: any;
  loading
  emailForm
  rolid=3
  trialPeriod=3
  countryList=[]
  constructor(private modalService: NgbModal,
    private fb:FormBuilder,
    public dialog: MatDialog,
    public alertCtrl: AlertController,
    private register:RegistrationService,
    public dialogRef: MatDialogRef<StartMyFreeTrialComponent>,
    private requestDemoSer:RequestDemoService,
    public loadingController: LoadingController,
    private PV:PhoneVerificationService,
    private trialPeriodSer:TrialPeriodService,
    private EV:EmailValidationService){ }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username:new FormControl(),
      firstname:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      lastname:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      phone:new FormControl('',Validators.compose([Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^[0-9]{10}$')])),
      email:new FormControl('',Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),Validators.minLength(6)])),
      password:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      confirm_password:new FormControl(),
      facilityid:new FormControl(''),
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    })
    this.trialPeriodSer.trialperiod.subscribe(trialPeriod => {
      this.trialPeriod = trialPeriod;
    });
    if(this.trialPeriod==undefined || this.trialPeriod==null){
      this.trialPeriod=3
    }
  }
  emailValidForm=false

  phoneFocusOut(){
    var phone={'phone':String(this.registrationForm.value.phone)}


    if(this.registrationForm.value.phone!=null && this.registrationForm.value.phone!=''){
      this.PV.phoneValidator(phone).subscribe(
         (response)=>{
          this.phoneMessage=response
          if( String(this.phoneMessage.message)==="Phone no is null or empty" ){

            // if(this.registrationForm.value.phone==null || this.registrationForm.value.phone==''){
              return  this.phoneValid=false
            // }

          }else if(String(this.phoneMessage.message)==="Phone number Exists!"){

            return  this.phoneValid=true
          }
        },(err)=>{console.log(err)},()=>{})
    }
  }
  signIn(){
  }
  changePhoneValue(){

            if(this.registrationForm.value.phone==null || this.registrationForm.value.phone==''){
              return  this.phoneValid=false
            }

  }
  confirm_Password(){
    if(this.hideConfirmPassword==true){
      this.hideConfirmPassword=false,this.confirmClassId=1
    }else{
      this.hideConfirmPassword=true,this.confirmClassId=0
    }
    return this.hideConfirmPassword,this.confirmClassId
  }
  passWord(){
    if(this.hidePassword==true){
    return  this.hidePassword=false,this.classId=1
    }else{
      return this.hidePassword=true,this.classId=0
    }

  }
  passWordClass(cId){
    if(0==cId ) {
      return 'password form-control';
    }else if(0!=cId ){
      return 'form-control';
    }

  }
  confirmPassWordClass(cId){
    if(0==cId ) {
      return 'password  form-control ';
    }else if(0!=cId ){
      return 'form-control';
    }

  }
  get username(){
    return this.registrationForm.get('username')
  }

  get firstname(){
   return this.registrationForm.get('firstname')
 }

 get lastname(){
  return this.registrationForm.get('lastname')
}
 get email(){
   return this.registrationForm.get('email')
 }

 get phone(){
   return this.registrationForm.get('phone')
 }

 get password(){
   return this.registrationForm.get('password')
 }
 get confirm_password(){
  return this.registrationForm.get('confirm_password')
}
 get facilityid(){
   return this.registrationForm.get('facilityid')
 }
 dismiss(){
  this.dialogRef.close();
}
  async onSubmit(registrationForm){

    this.loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner:'bubbles',
      message: 'Please Wait...',
      duration: 10000,

    });
    await this.loading.present();
     var tempObj
     tempObj={
      "username":this.registrationForm.value.email,
      "phone":this.registrationForm.value.phone,
      "password":this.registrationForm.value.password,
       "firstname":this.registrationForm.value.firstname,
      "lastname":this.registrationForm.value.lastname,
      "start_date":new Date().getFullYear()+'-'+(Number(new Date().getMonth())+ + +1)+'-'+new Date().getDate(),
      "end_date":null,
      "trial_period":this.trialPeriod,
      "role_id_ref":3
     }
     var email={'username':this.registrationForm.controls.email.value}
     this.EV.emailValidator(email).subscribe(
       async (response)=>{
         this.emailMessage=response
         if(String(this.emailMessage.message)==="It's a new Email!"){


     this.register.registerNewUser(tempObj).subscribe(
      async (response)=>{
        this.EV.emailVerification(this.registrationForm.controls.email.value).subscribe(
          async (response)=>{
            // this.register.sendNotificationAfterCreatingAnAccount(this.registrationForm.controls.email.value,this.registrationForm.controls.firstname.value,this.registrationForm.controls.lastname.value).subscribe((res)=>{
              this.registrationForm.reset()
            // },(err)=>{console.log(err)},()=>{   this.registrationForm.reset()})
            await this.loading.dismiss();
            Swal.fire({

              title: 'Success!',
              html: 'Your account is created!<br> A verification link has been sent to your email account.',
              icon: 'success',
              showCancelButton: false,
              imageHeight:'250px',
              heightAuto:false,
              confirmButtonText: 'Close',
              confirmButtonColor:'#ff6700',

            }).then((result) => {if (result.isConfirmed) {  this.dialogRef.close();}})
          },async (err)=>{console.log(err) ;
             await this.loading.dismiss();},()=>{})
        },async (error)=>{
          await this.loading.dismiss();
          Swal.fire({
            title: 'Error!',
            html: 'Something went wrong. Please try again later.',
            icon: 'error',
            showCancelButton: false,
            imageHeight:'250px',
            heightAuto:false,
            // confirmButtonText: 'Continue',
            confirmButtonColor: '#FF0000',

          }).then((result) => {this.registrationForm.reset()})
        },
        async () => {

        }
      )
          return  this.emailValid=false
        }else if(String(this.emailMessage.message)==="Email Exists!" ){
          await this.loading.dismiss();
          return  this.emailValid=true
        }
      },async (err)=>{console.log(err);
        await this.loading.dismiss();},()=>{})

   }
   ConfirmedValidator(controlName: string, matchingControlName: string){
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
          if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
              return;
          }
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ confirmedValidator: true });
          } else {
              matchingControl.setErrors(null);
          }
      }
    }
    emailFocusOut(){
      var email={'username':this.registrationForm.controls.email.value}

      this.EV.emailValidator(email).subscribe(
        (response)=>{
          this.emailMessage=response
          if(String(this.emailMessage.message)==="It's a new Email!"){

            return  this.emailValid=false
          }else if(String(this.emailMessage.message)==="Email Exists!" ){
            return  this.emailValid=true
          }
        },(err)=>{console.log(err)},()=>{})
    }

}
