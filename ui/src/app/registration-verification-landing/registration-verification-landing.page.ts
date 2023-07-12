import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { LoginService } from '../services/login.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { EmailValidationService } from '../services/email-validation.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-registration-verification-landing',
  templateUrl: './registration-verification-landing.page.html',
  styleUrls: ['./registration-verification-landing.page.scss'],
})
export class RegistrationVerificationLandingPage implements OnInit {
  errorMsg: any;
  hidePassword=true
  hideConfirmPassword=true
  classId=0
  confirmClassId=0
  emailValid
  url_token
  email_id
  verification_code
  email_is_verfied: any;
  user_data: any;
  lastname=undefined
  firstname=undefined
  constructor(public navCtrl: NavController,
    private fb:FormBuilder,
    private actRoute: ActivatedRoute,
    private loginSer:LoginService,
    private ev:EmailValidationService,
    private forgot_pass:ForgotPasswordService,) {
      this.actRoute.queryParams.subscribe(params=>{
        this.email_id=decodeURIComponent(params.email)
        this.verification_code=params.verificationcode
        this.firstname=params.firstname
        this.lastname=params.lastname
      })

    }
    decodeURIComponentSafe(s) {
      if (!s) {
          return s;
      }
      return decodeURIComponent(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
  }
  ngOnInit() {
    this.actRoute.queryParams.subscribe(params=>{
      this.email_id=decodeURIComponent(params.email)
      this.verification_code=params.verificationcode

    })
console.log(this.firstname)
console.log(this.lastname)
    // this.actRoute.paramMap.subscribe((params: ParamMap)=> {
    //   this.email_id= (params.get('_email'))
    //   // this.email_id_for_reset_password="vrushang.patel@mercuriusinc.com"
    //   this.verification_code= (params.get('_code'))

      // this.token_for_reset_password= 'A9kh7o54atHKikCpPyvqofXJQmqrz14DLq0KhoYBUdqBjkb1KL0POCFxVzloy7S9'



    // })
this.getUserData(this.email_id,this.verification_code)

  }
  getUserData(email,code){
    var getUserData={"username":email}

    this.loginSer.getUserAllDetails(getUserData).subscribe(
       (data)=>{

         this.user_data=data

        // if(this.user_data.verification_code==code){
          this.ev.verifiedEmail(code).subscribe(
            (respons)=>{

            }
          )
        // }
        // this.userDetails=
        // if(respons){
        // this.forgot_pass.verifyEmailForFP(this.token_for_reset_password).subscribe(
        //   async (res)=>{
        //
        //     this.email_is_verfied=res;


        //   }
        // )}


          },
            (error: any)=>{this.errorMsg=error
            console.log(this.errorMsg)},
            ()=>{
            }
            );

  }
login(){
  this.navCtrl.navigateBack([straightlines_io_apis.apis.login_api])
}
}

