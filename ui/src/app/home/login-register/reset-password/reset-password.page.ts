import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { ForgotPasswordService } from 'src/app/services/forgot-password.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  errorMsg: any;
  forgotPassword: FormGroup;
  hidePassword=true
  hideConfirmPassword=true
  classId=0
  confirmClassId=0
  emailValid
  url_token
  email_id_for_reset_password
  token_for_reset_password
  email_is_verfied: any;
  constructor(public navCtrl: NavController,
    private fb:FormBuilder,
    private actRoute: ActivatedRoute,
    private loginSer:LoginService,
    private forgot_pass:ForgotPasswordService,) {
      this.actRoute.queryParams.subscribe(params=>{
        this.email_id_for_reset_password=params.email
        this.token_for_reset_password=params.verificationcode

      })
    }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(params=>{
      this.email_id_for_reset_password=params.email
      this.token_for_reset_password=params.verificationcode

    })
    this.getUserData(this.email_id_for_reset_password)
    this.forgotPassword = this.fb.group({
      email:new FormControl(this.email_id_for_reset_password,Validators.compose([Validators.required])),
      password:new FormControl('',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(64)])),
      confirm_password:new FormControl(),
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    })


    this.forgot_pass.emailVerify(this.email_id_for_reset_password).subscribe(
      async (response)=>{
      },
      (error: any)=>{
        this.errorMsg=error.error.text;
        this.url_token=this.errorMsg
        if(String(this.url_token)=="Invalid email id."){
          this.emailValid=true
        }else{
          this.emailValid=false
        }
      },
      async () => {
      }
    )
  }
  tokenforresetPassword
  getUserData(email){
    var getUserData={"username":email}
    this.loginSer.getUserAllDetails(getUserData).subscribe(
       (respons)=>{
        if(respons){
        this.forgot_pass.verifyEmailForFP(this.token_for_reset_password).subscribe(
          async (res)=>{
            this.email_is_verfied=res;
          if(this.email_is_verfied==false){
            this.navCtrl.navigateBack([straightlines_io_apis.apis.login_api])
          }else{
            this.loginSer.getUserAllDetails({"username":email}).subscribe((res)=>{
              var temp
              temp=res
              this.tokenforresetPassword=temp.token
            },(err)=>{},
              async ()=>{
              })

          }
          },
          (error: any)=>{this.errorMsg=error;
          },
          async () => {

          }
        )}


          },
            (error: any)=>{this.errorMsg=error
            console.log(this.errorMsg)},
            ()=>{
            }
            );

  }
  signIn(){
    this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api)


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
  get email(){
    return this.forgotPassword.get('email')
  }



  get password(){
    return this.forgotPassword.get('password')
  }
  get confirm_password(){
    return this.forgotPassword.get('confirm_password')
  }
  // focusOut(){

  // var email=this.forgotPassword.value.email
  // this.forgot_pass.emailVerify(email).subscribe(
  //   async (response)=>{

  //   },
  //   (error: any)=>{


  //     this.errorMsg=error.error.text;
  //     this.url_token=this.errorMsg

  //     if(String(this.url_token)=="Invalid email id."){
  //       this.emailValid=true
//
      // }
      // if(String(this.url_token).substr(0,47)=="https://18.119.62.157:2020/reset-password?token="){
      //   this.emailValid=false
      // }
      // if(String(this.url_token).substr(0,45)=="https://3.13.254.87:2021/reset-password?token="){
      //   this.emailValid=false
      // }
      // if(String(this.url_token).substr(0,45)=="https://52.14.8.217:2020/reset-password?token="){
      //   this.emailValid=false
      // }
      // if(String(this.url_token).substr(0,47)=="https://3.140.109.198:2020/reset-password?token="){
      //   this.emailValid=false
      // }
  // },
//     async () => {

//     }
//   )
// }
changeEmailID(){
  if(this.emailValid==true){
    return this.emailValid=false
  }
}
passwordChanged(pass){

  // this.navCtrl.navigateForward('password-changed-message')
}
resetPass(pass){
this.forgot_pass.updatePass(this.tokenforresetPassword,this.forgotPassword.value.password).subscribe(
  async (response)=>{

    Swal.fire({
      title: 'Success!',
      html: 'Your password changed successfully.',
      icon: 'success',
      showCancelButton: false,
      imageHeight:'250px',
      heightAuto:false,
      confirmButtonText: 'Ok',
      confirmButtonColor:'#ff6700',
    }).then((result) => {
      if (result.isConfirmed) {
        this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api)
      }
    })
  },
  (error: any)=>{this.errorMsg=error;
    if(this.errorMsg.error.text=='Your password successfully updated.' && this.errorMsg.status==200)
{
  Swal.fire({
    title: 'Success!',
    html: 'Your password changed successfully.',
    icon: 'success',
    showCancelButton: false,
    imageHeight:'250px',
    heightAuto:false,
    confirmButtonText: 'Ok',
    confirmButtonColor:'#ff6700',
  }).then((result) => {
    if (result.isConfirmed) {
      this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api)
    }
  })
} else{   Swal.fire({

      title: 'Error!',
      html: 'Something went wrong. Please try again later.',
      icon: 'error',
      showCancelButton: false,
      imageHeight:'250px',
      heightAuto:false,
      confirmButtonColor: '#FF0000',
    }).then((result) => {
      this.ngOnInit()
    })
  }
  },
  async () => {

  }
)
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
    return 'password  form-control app-font-primary-color ion-border-1px-mercurius-secondary-color ion-no-margin ion-no-padding';
  }else if(0!=cId ){
    return 'form-control app-font-primary-color ion-border-1px-mercurius-secondary-color ion-no-margin ion-no-padding';
  }

}
confirmPassWordClass(cId){
  if(0==cId ) {
    return 'password  form-control app-font-primary-color ion-border-1px-mercurius-secondary-color ion-no-margin ion-no-padding';
  }else if(0!=cId ){
    return 'form-control app-font-primary-color ion-border-1px-mercurius-secondary-colorion-no-margin ion-no-padding';
  }

}
}
