import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-request-demo-model',
  templateUrl: './request-demo-model.component.html',
  styleUrls: ['./request-demo-model.component.scss'],
})
export class RequestDemoModelComponent implements OnInit {
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
    public dialogRef: MatDialogRef<RequestDemoModelComponent>,
    private requestDemoSer:RequestDemoService,
    public loadingController: LoadingController,
    private PV:PhoneVerificationService,
    private trialPeriodSer:TrialPeriodService,
    private EV:EmailValidationService) { }

  ngOnInit() {
    this.countryList=[]
    this.requestDemoSer.getCountryList().subscribe((res)=>{
      this.countryList=res
      // this.countryList.push('Select')
    },(err)=>{console.log(err)
      // this.countryList.push('Select')
  },()=>{})
  if(this.countryList.length<1){
    this.countryList.push('United States of America')
  }
    this.emailForm = this.fb.group({
      firstnamedemo:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      lastnamedemo:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      email1:new FormControl('',Validators.compose([Validators.required,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),Validators.minLength(6)])),
      phonedemo:new FormControl('',Validators.compose([Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^[0-9]{10}$')])),
      companydemo:new FormControl(''),
      comments:new FormControl('',Validators.compose([Validators.maxLength(this.maxLength)])),
      country:new FormControl('United States of America')
  })

  }
  wordCount
  @ViewChild("commentstext") commentstext: ElementRef;
  words: any;
  remaingChar=0
  maxLength=2000
  currentCharLen=0
  wordCounter() {
    const currentLength =this.commentstext.nativeElement.value.length;

    this.currentCharLen=currentLength
    this.remaingChar=this.maxLength+ - +currentLength
  }
  checkLength(){
    if((this.currentCharLen)<=this.maxLength){
      return true
    }else{
      return false
    }
  }

  checkLengthCSs(){
    if(this.maxLength+ - +this.currentCharLen<10){
      return 'font-normal app-font-red-color'
    }else{
      return 'font-normal'
    }
  }
  get email1(){
    return this.emailForm.get('email1')
  }
  get firstnamedemo(){
    return this.emailForm.get('firstnamedemo')
  }
  get lastnamedemo(){
    return this.emailForm.get('lastnamedemo')
  }
  get country(){
    return this.emailForm.get('country')
  }
  get comments(){
    return this.emailForm.get('comments')
  }
  get phonedemo(){
    return this.emailForm.get('phonedemo')
  }
  get companydemo(){
    return this.emailForm.get('companydemo')
  }
  emailValidForm=false
  emailFocusOutTwo(){
    this.emailValid=false
    var email={'username':this.emailForm.controls.email1.value}
  if(email.username!=''&&email.username!=undefined&&email.username!=null){
    this.EV.emailValidator(email).subscribe(
      (response)=>{
        this.emailMessage=response
        if(String(this.emailMessage.message)==="It's a new Email!"){

          return  this.emailValidForm=false
        }else if(String(this.emailMessage.message)==="Email Exists!" ){
          return  this.emailValidForm=true
        }

      },(err)=>{console.log(err)},()=>{})
    }
  }
  dismiss(){
    this.dialogRef.close();
  }
  async close(){
        this.loading = await this.loadingController.create({
          cssClass: 'custom-loading',
          spinner:'bubbles',
          message: 'Please Wait...',
          duration: 10000,

        });
        await this.loading.present();
       var temp= {
          "fname":this.emailForm.value.firstnamedemo,
          "lname":this.emailForm.value.lastnamedemo,
          "phone":this.emailForm.value.phonedemo,
          "email":this.emailForm.value.email1,
          "company":this.emailForm.value.companydemo,
          "country":this.emailForm.value.country,
          "notes":this.emailForm.value.comments
      }
      console.log(temp)
      this.requestDemoSer.sendRequestDemo(temp).subscribe(async (res)=>{
        await this.loading.dismiss();

          Swal.fire({
            title: 'Success!',html: 'Request Sent!',icon: 'success',
            showCancelButton: false,
            imageHeight:'250px',heightAuto:false,confirmButtonText: 'Close',confirmButtonColor:'#ff6700',
          }).then((result) => {if (result.isConfirmed) {}})
          this.emailForm.reset();
          this.emailForm.controls.country.setValue('United States of America')
          this.dialogRef.close();
      }
      ,async (err)=>{console.log(err)
        await this.loading.dismiss();
        Swal.fire({
          title: 'Error!',html: 'Something went wrong. Please try again later.',
          icon: 'error',showCancelButton: false,imageHeight:'250px',heightAuto:false,confirmButtonColor: '#FF0000',
        }).then((result) => {this.emailForm.reset()
          this.emailForm.controls.country.setValue('United States of America')
        })},()=>{})
  }
}
