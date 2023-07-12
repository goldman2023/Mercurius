import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { RegistrationService } from 'src/app/services/registration.service';
import Swal from 'sweetalert2';
import straightlines_io_apis from 'src/app/json/apis.json';
import { PhoneVerificationService } from 'src/app/services/phone-verification/phone-verification.service';
import { ActivatedRoute } from '@angular/router';
import { TrialPeriodService } from 'src/app/services/trial-period.service';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registrationForm: FormGroup;
  errorMsg: any;
  emailValid;
  phoneValid;
  empUser;
  empFname;
  empLname;
  checkEmployee = false;
  hidePassword = true;
  hideConfirmPassword = true;
  classId = 0;
  confirmClassId = 0;
  emailMessage: any;
  phoneMessage: any;
  loading;
  trialPeriod = 3;
  rolid = 3;
  pattarn = '^[_A-Za-z0-9-\\+]*(\\.[_A-Za-z0-9-]+)*(\\+[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public alertCtrl: AlertController,
    private trialPeriodSer: TrialPeriodService,
    private register: RegistrationService,
    public loadingController: LoadingController,
    private PV: PhoneVerificationService,
    private EV: EmailValidationService,
    private headerTitleService: HeaderTitleService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.empUser = params.email;
      this.empFname = params.firstname;
      this.empLname = params.lastname;
      this.rolid = params.role;
    });
    if (this.rolid > 3 || this.rolid < 1 || this.rolid == undefined) {
      this.rolid = 3;
    }
  }

  ngOnInit() {
    this.headerTitleService.setTitle('Sign Up');
    this.headerTitleService.setBackUrl(straightlines_io_apis.apis.login_api);
    this.headerTitleService.setForwardUrl('');
    this.route.queryParams.subscribe((params) => {
      this.empUser = params.email;
      this.empFname = params.firstname;
      this.empLname = params.lastname;
      this.rolid = params.role;
      if (this.rolid > 3 || this.rolid < 1 || this.rolid == undefined) {
        this.rolid = 3;
      }
    });

    this.registrationForm = this.fb.group(
      {
        username: new FormControl(),
        firstname: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(64),
          ])
        ),
        // phone:new FormControl('',Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(10)])),
        // username:new FormControl('',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(8)])),
        lastname: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(64),
          ])
        ),
        phone: new FormControl(
          '',
          Validators.compose([
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern('^[0-9]{10}$'),
          ])
        ),
        email: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              this.pattarn
            ),
            Validators.minLength(6),
          ])
        ),
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(64),
          ])
        ),
        confirm_password: new FormControl(),
        facilityid: new FormControl('198'),
        // facilityid:new FormControl('21',Validators.compose([Validators.required])),
        // terms:[false, Validators.requiredTrue]
        // terms:[false, Validators.requiredTrue]
      },
      {
        validator: this.ConfirmedValidator('password', 'confirm_password'),
      }
    );

    if (this.empUser != undefined && this.empUser != null) {
      this.checkEmployee = true;
      this.registrationForm.controls.email.disable();
      this.registrationForm.controls.email.setValue(this.empUser);
    } else {
      this.checkEmployee = false;
      this.registrationForm.controls.email.enable();
    }

    if (this.empFname != undefined && this.empFname != null) {
      this.registrationForm.controls.firstname.disable();
      this.registrationForm.controls.firstname.setValue(this.empFname);
    } else {
      this.registrationForm.controls.firstname.enable();
    }

    if (this.empLname != undefined && this.empLname != null) {
      this.registrationForm.controls.lastname.disable();
      this.registrationForm.controls.lastname.setValue(this.empLname);
    } else {
      this.registrationForm.controls.lastname.enable();
    }
    this.trialPeriodSer.trialperiod.subscribe((trialPeriod) => {
      this.trialPeriod = trialPeriod;
    });
    if (this.trialPeriod == undefined || this.trialPeriod == null) {
      this.trialPeriod = 3;
    }
  }
  gotoNextField(nextElement) {
    nextElement.setFocus();
  }
  get username() {
    return this.registrationForm.get('username');
  }

  get firstname() {
    return this.registrationForm.get('firstname');
  }

  get lastname() {
    return this.registrationForm.get('lastname');
  }
  get email() {
    return this.registrationForm.get('email');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get password() {
    return this.registrationForm.get('password');
  }
  get confirm_password() {
    return this.registrationForm.get('confirm_password');
  }
  get facilityid() {
    return this.registrationForm.get('facilityid');
  }

  async onSubmit(data) {
    this.loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner: 'bubbles',
      message: 'Please Wait...',
      duration: 10000,
    });
    await this.loading.present();
    var registerData = {
      username: this.registrationForm.controls.email.value,
      password: this.registrationForm.controls.password.value,
      firstname: this.registrationForm.controls.firstname.value,
      lastname: this.registrationForm.controls.lastname.value,
      email: '',
      createdby: ' ',
      phone: String(this.registrationForm.controls.phone.value),
      facilityid: '',
    };
    this.EV.emailValidator({
      username: this.registrationForm.controls.email.value,
    }).subscribe(
      async (response) => {
        this.emailMessage = response;
        if (String(this.emailMessage.message) === "It's a new Email!") {
          return this.finalSubmit();
        } else if (String(this.emailMessage.message) === 'Email Exists!') {
          await this.loading.dismiss();
          return (this.emailValid = true);
        }
      },
      async (err) => {
        console.log(err);
        await this.loading.dismiss();
      },
      () => {}
    );
  }
  clearInputPassword(event) {
    this.registrationForm.controls.password.setValue('');
  }
  clearInputCoPassword(event) {
    this.registrationForm.controls.confirm_password.setValue('');
  }
  clearForm() {
    this.registrationForm.controls.firstname.setValue('');
    this.registrationForm.controls.lastname.setValue('');
    this.registrationForm.controls.email.setValue('');
    this.registrationForm.controls.phone.setValue('');
    this.registrationForm.controls.password.setValue('');
    this.registrationForm.controls.confirm_password.setValue('');
  }
  finalSubmit() {
    var registerData;
    if (this.rolid == 3) {
      registerData = {
        username: this.registrationForm.controls.email.value,
        password: this.registrationForm.controls.password.value,
        firstname: this.registrationForm.controls.firstname.value,
        lastname: this.registrationForm.controls.lastname.value,
        email: '',
        createdby: ' ',
        role_id_ref: this.rolid,
        phone: String(this.registrationForm.controls.phone.value),
        facilityid: '',
        start_date:
          new Date().getFullYear() +
          '-' +
          (Number(new Date().getMonth()) + +(+1)) +
          '-' +
          new Date().getDate(),
        end_date: null,
        trial_period: this.trialPeriod,
      };
    } else {
      registerData = {
        username: this.registrationForm.controls.email.value,
        password: this.registrationForm.controls.password.value,
        firstname: this.registrationForm.controls.firstname.value,
        lastname: this.registrationForm.controls.lastname.value,
        email: '',
        createdby: ' ',
        role_id_ref: this.rolid,
        phone: String(this.registrationForm.controls.phone.value),
        facilityid: '',
        start_date: null,
        end_date: null,
        trial_period: 0,
      };
    }

    this.register.registerNewUser(registerData).subscribe(
      async (response) => {
        this.EV.emailVerification(
          this.registrationForm.controls.email.value
        ).subscribe(
          async (response) => {
            // this.register.sendNotificationAfterCreatingAnAccount(this.registrationForm.controls.email.value,this.registrationForm.controls.firstname.value,this.registrationForm.controls.lastname.value).subscribe((res)=>{

            // },(err)=>{console.log(err)},()=>{})
            await this.loading.dismiss();
            Swal.fire({
              title: 'Success!',
              html: 'Your account is created!<br> A verification link has been sent to your email account.',
              icon: 'success',
              showCancelButton: false,
              imageHeight: '250px',
              heightAuto: false,
              confirmButtonText: 'Continue',
              confirmButtonColor: '#ff6700',
            }).then((result) => {
              this.registrationForm.reset();
              if (result.isConfirmed) {
                this.navCtrl.navigateForward('login');
              }
            });
          },
          async (error) => {
            await this.loading.dismiss();
            Swal.fire({
              title: 'Error!',
              html: 'Something went wrong. Please try again later.',
              icon: 'error',
              showCancelButton: false,
              imageHeight: '250px',
              heightAuto: false,
              // confirmButtonText: 'Continue',
              confirmButtonColor: '#FF0000',
            }).then((result) => {
              this.registrationForm.reset();
            });
          }
        );
      },
      async (error: any) => {
        this.errorMsg = error;
        console.log(this.errorMsg);
        await this.loading.dismiss();
        Swal.fire({
          title: 'Error!',
          html: 'Something went wrong. Please try again later.',
          icon: 'error',
          showCancelButton: false,
          imageHeight: '250px',
          heightAuto: false,
          // confirmButtonText: 'Continue',
          confirmButtonColor: '#FF0000',
        }).then((result) => {
          this.registrationForm.reset();
        });
      },
      async () => {}
    );
  }
  test() {
    // Swal.fire('Congrats!', 'Your account is created!', 'success')
    Swal.fire({
      title: 'Success!',

      html: 'Your account is created!<br> A verification link has been sent to your email account.',
      icon: 'success',
      showCancelButton: false,
      imageHeight: '250px',
      heightAuto: false,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#ff6700',
      // buttonsStyling:false,
      // button
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  emailFocusOut() {
    var email = { username: this.registrationForm.controls.email.value };
    this.EV.emailValidator(email).subscribe(
      (response) => {
        this.emailMessage = response;
        //
        if (String(this.emailMessage.message) === "It's a new Email!") {
          return (this.emailValid = false);
        } else if (String(this.emailMessage.message) === 'Email Exists!') {
          return (this.emailValid = true);
        }
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }
  phoneFocusOut() {
    var phone = { phone: this.registrationForm.value.phone };
    if (
      this.registrationForm.value.phone !== null &&
      this.registrationForm.value.phone !== ''
    ) {
      this.PV.phoneValidator(phone).subscribe(async (response) => {
        this.phoneMessage = response;
        if (String(this.phoneMessage.message) === 'Phone no is null or empty') {
          // if(this.registrationForm.value.phone==null || this.registrationForm.value.phone==''){
          return (this.phoneValid = false);
          // }
        } else if (
          String(this.phoneMessage.message) === 'Phone number Exists!'
        ) {
          return (this.phoneValid = true);
        }
      });
    }
  }
  changePhoneValue() {
    if (
      this.registrationForm.value.phone == null ||
      this.registrationForm.value.phone == ''
    ) {
      return (this.phoneValid = false);
    }
  }
  confirm_Password() {
    if (this.hideConfirmPassword == true) {
      (this.hideConfirmPassword = false), (this.confirmClassId = 1);
    } else {
      (this.hideConfirmPassword = true), (this.confirmClassId = 0);
    }
    return this.hideConfirmPassword, this.confirmClassId;
  }
  passWord() {
    if (this.hidePassword == true) {
      return (this.hidePassword = false), (this.classId = 1);
    } else {
      return (this.hidePassword = true), (this.classId = 0);
    }
  }
  passWordClass(cId) {
    if (0 == cId) {
      return 'password  form-control app-font-primary-color ion-border-1px-mercurius-secondary-color ion-no-margin ion-no-padding';
    } else if (0 != cId) {
      return 'form-control app-font-primary-color ion-no-margin ion-border-1px-mercurius-secondary-color ion-no-padding';
    }
  }
  confirmPassWordClass(cId) {
    if (0 == cId) {
      return 'password  form-control app-font-primary-color ion-no-margin ion-border-1px-mercurius-secondary-color ion-no-padding';
    } else if (0 != cId) {
      return 'form-control app-font-primary-color ion-no-margin ion-border-1px-mercurius-secondary-color ion-no-padding';
    }
  }
}
