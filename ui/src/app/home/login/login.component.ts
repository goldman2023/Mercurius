import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  NavController,
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { WorkLoadService } from 'src/app/services/work-load.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import workloadData from 'src/app/json/work-load-data.json';
import { LoginService } from 'src/app/services/login.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import Swal from 'sweetalert2';
import { StraightlinesIoVideoPage } from 'src/app/home/straightlines-io-video/straightlines-io-video.page';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { ForgotPasswordService } from 'src/app/services/forgot-password.service';
import { LocalDataService } from 'src/app/services/data/local-data.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  worData = workloadData;
  t;
  hidePassword = true;
  classId = 0;
  checked: boolean = true;
  invalid_email_password = false;
  valueforngif = true;
  allShift: any;
  errorMsg: any;
  default_work_load_data = workloadData;
  work_load_data;
  allShiftData;
  shiftLen;
  allll = [] as any;
  sh_startTime;
  shift_name;
  convertTimetoString;
  allShiftName = [] as any;
  test1: { sh_name: any };
  arrangeShiftdefintionG = [];
  arrangeShiftdefintionL = [];
  safeURL;
  isKeyboardHide = true;
  user_data;
  videoUrl = 'assets/video/straughtlines-io.mp4';
  loginForm: FormGroup;
  saveusername: FormGroup;
  invalid_username_password = false;
  userDetails: any;
  inputEmail: any;
  emailValid: boolean;
  forgotPasswordEmail: any;
  forgotPasswordEmailValid: boolean;
  url_token: any;
  emailMessage: any;
  constructor(
    public route: Router,
    public navCtrl: NavController,
    private shiftDefSer: WorkLoadService,
    public modalCtrl: ModalController,
    private loginSer: LoginService,
    private EV: EmailValidationService,
    private FP: ForgotPasswordService,
    public alertController: AlertController,
    private localData: LocalDataService,
    public loadingController: LoadingController,
    private cd: ChangeDetectorRef,
    public fb: FormBuilder,
    private _sanitizer: DomSanitizer,
  ) {
    this.safeURL = this.videoUrl;
    const user: any = JSON.parse(sessionStorage.getItem(
      'userData'
    ))
    if(user){
      switch(user.role){
        case 'bidmanager':
          this.bidManager(user);
          break;
        case 'emp':
          this.navCtrl.navigateForward(
            straightlines_io_apis.apis.employee_home
          );
          break;
        case 'guest':
          this.bidManager(user);
          break;
      }
    }
  }
  //   ionViewDidEnter(){
  //  this.ngOnInit()
  // }
  ionViewWillEnter() {
    this.ngOnInit();
  }
  ngOnInit() {
    const loginData = JSON.parse(this.localData.getItem('userLoginData'));
    if (loginData !== null) {
      if (loginData.saveUser == true) {
        this.loginForm = this.fb.group({
          username: new FormControl(
            loginData.username,
            Validators.compose([Validators.required])
          ),
          password: new FormControl(
            '',
            Validators.compose([Validators.required])
          ),
          remberMe: new FormControl(true),
        });
        this.cd.detectChanges();
        this.saveusername = this.fb.group({
          checkBox: [true],
        });
      } else {
        this.loginForm = this.fb.group({
          username: new FormControl(
            '',
            Validators.compose([Validators.required])
          ),
          password: new FormControl(
            '',
            Validators.compose([Validators.required])
          ),
          remberMe: new FormControl(false),
        });
        this.saveusername = this.fb.group({
          checkBox: [false],
        });
      }
    } else {
      this.loginForm = this.fb.group({
        username: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        password: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        remberMe: new FormControl(false),
      });
      this.saveusername = this.fb.group({
        checkBox: [false],
      });
    }
  }
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
  signUp() {
    this.navCtrl.navigateForward(straightlines_io_apis.apis.register_api);
  }
  passwordChange() {
    this.invalid_email_password = false;
  }
  gotoNextField(nextElement) {
    nextElement.setFocus();
  }
  async checkLoggedInPerson() {
    this.signIn();
  }
  loading;
  async signIn() {
    this.loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      spinner: 'bubbles',
      message: 'Please Wait...',
      duration: 1000,
    });
    await this.loading.present();
    this.localData.removeItem('myBiddingData');

    var loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.loginSer.authenticate(loginData).subscribe(
      async (response: any) => {
        if (response) {
          if (response.enabled) {
            let startDate, endDate;
            if (![1, 2].includes(response.role_id_ref)) {
              startDate = new Date(
                response.start_date.split('-')[0],
                Number(response.start_date.split('-')[1]) - 1,
                response.start_date.split('-')[2],
                0,
                0,
                0
              );
              endDate = new Date(
                response.end_date.split('-')[0],
                Number(response.end_date.split('-')[1]) - 1,
                Number(response.end_date.split('-')[2]) + 1,
                0,
                0,
                0
              );
            }

            if ( ![1, 2].includes(response.role_id_ref) &&
              startDate.getTime() <= endDate.getTime() &&
              endDate.getTime() < new Date().getTime()
            ) {this.trialPeriodExpired()}
            else {
              this.loginSer.getUserDetails(response.id, response.role_id_ref).subscribe(userDetails => {
                var tempObj = {
                  id: response.id,
                  role: (response.role_id_ref == 1 && 'bidmanager') || (response.role_id_ref == 2 && 'emp') || 'guest',
                  role_id_ref: response.role_id_ref,
                  username: response.username,
                  fname: response.firstname,
                  lname: response.lastname,
                  area_id:userDetails.areaid,
                  facilityname:userDetails.facilityname,
                  areaname:userDetails.areaname,
                  facilityid:userDetails.facilityid,
                  bidmap:userDetails.bidscheduleDetails,
                  empid:userDetails.empid,
                  bidmanagerid:userDetails.bidmanagerid,
                  permissionDetails:userDetails.permissionDetails,
                };
                sessionStorage.setItem(
                  'userData',
                  JSON.stringify(tempObj)
                );
                sessionStorage.setItem(
                  'token',
                  JSON.stringify(response['accessToken'])
                );
                this.bidManager(response);
                this.invalid_email_password = false;
              })
              
              
            }
          }
          else {
            Swal.fire({
              title: 'Error!',
              html:
                'Your Email address could not be verified! Please check your email and verfiy your account.' +
                "<ion-input id='resend_email' name='email' type='text' placeholder='Enter your email address' class='mt-3 text-start ion-border-1px-mercurius-secondary-color app-font-primary-color ion-no-margin ion-no-padding p-2' style='border-radius: 5px'></ion-input>",
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: true,
              imageHeight: '200px',
              heightAuto: false,
              confirmButtonText: 'Send',
              confirmButtonColor: '#ff6700',
              preConfirm: () => {
                let email: string = (
                  document.getElementById('resend_email') as HTMLInputElement
                ).value;
                this.inputEmail = email;
                return email;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this.EV.emailVerification(this.inputEmail).subscribe(
                  (_) => {},
                  (error) => {
                    console.log(error)
                  }
                );
              }
            });
          }
        }
        else {
          this.invalid_email_password = true;
          await this.loading.dismiss();
        }
      },
      async (error: any) => {
        this.errorMsg = error;
        await this.loading.dismiss();
        if (this.errorMsg) this.invalid_email_password = true;
      }
    );
  }

  async trialPeriodExpired() {
    await this.loading.dismiss();
    Swal.fire({
      // title: 'Alert!',
      html: 'Your trial period has expired! Please upgrade your plan.',
      icon: 'warning',
      showCancelButton: false,
      imageHeight: '250px',
      heightAuto: false,
      // confirmButtonText: 'Continue',
      confirmButtonColor: '#ff6700',
    }).then((result) => {});
  }

  bidManager(response) {
    var temp;
    temp = response;
    this.localData.setItem(
      'PWP-PSO',
      JSON.stringify({
        PWP: ['EVE', 'EVE', 'DAY', 'DAY', 'MID'],
        PSO: ['1500', '1300', '0700', '0600', '2300'],
      })
    );
    this.user_data = { user_id: temp.id, email: temp.username };

    if (response) {
      this.shiftDefSer.getAllShiftDefinition(this.user_data.user_id).subscribe(
        (res) => {
          this.allShift = res;
          var user_all_shift = [];
          for (var i = 0; i < this.allShift.length; i++) {
            if (
              Number(this.allShift[i].userid) == Number(this.user_data.user_id)
            ) {
              user_all_shift.push(this.allShift[i]);
            }
          }
          //
          this.localData.setItem('allShift', JSON.stringify(user_all_shift));
          this.allShiftdata();
        },
        (error: any) => {
          this.errorMsg = error;
          this.allDefaultShiftdata();
        },
        () => {}
      );
    }
  }

  verfiyEmail() {
    ('resend');
  }
  async video() {
    window.open(
      'https://www.youtube.com/watch?v=lcqJ5N4Ic38',
      '_self',
      'location=yes'
    );
  }
  focusIn() {
    if (/Android/i.test(navigator.userAgent)) {
      if (navigator.platform !== 'Win32' && navigator.platform !== 'Win16') {
        this.valueforngif = false;
      }
    }
    this.t = navigator.platform;
  }
  focusOut() {
    if (/Android/i.test(navigator.userAgent)) {
      if (navigator.platform !== 'Win32' && navigator.platform !== 'Win16') {
        this.valueforngif = true;
      }
    }
  }
  saveUsername() {
    var isChecked = this.saveusername.value.checkBox;
    if (!isChecked) {
      var userData = {
        saveUser: !isChecked,
        username: this.loginForm.value.username,
      };
      this.localData.setItem('userLoginData', JSON.stringify(userData));
    } else {
      const userData = { saveUser: !isChecked, username: '' };
      this.localData.setItem('userLoginData', JSON.stringify(userData));
    }
  }

  private isValidEmail(email: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  start() {
    this.navCtrl.navigateForward(straightlines_io_apis.apis.dashboard);
  }

  passwordReset() {
    Swal.fire({
      title: 'Reset Password',
      html:
        'Enter your verified email address to send a verification link' +
        "<ion-input id='email' name='email' type='text' placeholder='example@mercuriusinc.com' class='mt-3 text-start ion-border-1px-mercurius-secondary-color app-font-primary-color ion-no-margin ion-no-padding p-2' style='border-radius: 5px'></ion-input>",
      width: 350,
      customClass: {
        confirmButton: 'btn app-buton-primary rounded-pill px-4',
        cancelButton:
          'btn app-buton-primary btn-disabled rounded-pill px-4 text-light',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to type something';
        } else {
          this.FP.emailVerificationForForgotPassword(value).subscribe((res) => {
            Swal.getConfirmButton().disabled = false;
          });
        }
      },
      didOpen: () => {
        Swal.getConfirmButton().disabled = true;
        (document.getElementById('email') as HTMLInputElement).addEventListener(
          'keyup',
          (e) => {
            Swal.getConfirmButton().disabled = !this.isValidEmail(
              (e.target as HTMLInputElement).value
            );
          }
        );
      },
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      imageHeight: '200px',
      heightAuto: false,
      confirmButtonText: 'Send',
      confirmButtonColor: '#ff6700',
      showLoaderOnConfirm: true,

      preConfirm: () => {
        let email: string = (
          document.getElementById('email') as HTMLInputElement
        ).value;
        this.forgotPasswordEmail = email;
        return email;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.EV.emailValidator({
          username: this.forgotPasswordEmail,
        }).subscribe(
          async (response) => {
            if (response !== null) {
              this.forgotPasswordEmailValid = true;
              this.FP.emailVerificationForForgotPassword(
                this.forgotPasswordEmail
              ).subscribe(
                (res) => {},
                (err) => {
                  this.forgotPasswordEmailValid = false;
                },
                async () => {}
              );
            } else {
              this.forgotPasswordEmailValid = false;
            }
          },
          (err) => {},
          () => {}
        );
      }
    });
  }
  selectInput(event) {
    this.loginForm.controls.password.setValue('');
  }
  onClickFeedback() {
    // this.navCtrl.navigateForward('feedback')
    window.open(
      'mailto:feedback@mercuriusinc.com?subject=Feedback: StraightLines'
    );
  }
  async allShiftdata() {
    this.allll = [];
    this.allShiftData = JSON.parse(this.localData.getItem('allShift'));

    this.test1 = { sh_name: null };
    this.localData.setItem('newSHiftDefinition', JSON.stringify(this.test1));
    this.work_load_data = [];
    for (var i = 0; i < this.default_work_load_data.length; i++) {
      this.work_load_data.push(this.default_work_load_data[i]);
    }

    if (this.allShiftData != null) {
      for (var i = 0; i < this.allShiftData.length; i++) {
        this.convertTimetoString = Array.from(
          this.allShiftData[i].sh_starttime
        );
        this.sh_startTime =
          this.convertTimetoString[0] +
          this.convertTimetoString[1] +
          this.convertTimetoString[3] +
          this.convertTimetoString[4];
        this.shift_name = this.allShiftData[i].sh_name;
        this.work_load_data.push({
          id: 9 + i,
          startTime: this.sh_startTime,

          Sun: '0',
          Mon: '0',
          Tue: '0',
          Wed: '0',
          Thu: '0',
          Fri: '0',
          Sat: '0',
          shiftName: this.shift_name,
          shift_duration: this.allShiftData[i].sh_duration,
          shiftCategory: this.allShiftData[i].sh_category_id,
          shift_created_by: this.allShiftData[i].sh_created_by,
          sh_include_exclude: this.allShiftData[i].sh_include_exclude,
        });
      }
    }
    this.arrangeShiftdefintionG = [];
    this.arrangeShiftdefintionL = [];
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (Number(this.work_load_data[i].startTime) > 2200) {
        this.arrangeShiftdefintionG.push(this.work_load_data[i]);
      } else if (Number(this.work_load_data[i].startTime) <= 2200) {
        this.arrangeShiftdefintionL.push(this.work_load_data[i]);
      }
    }
    this.arrangeShiftdefintionG.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    this.arrangeShiftdefintionL.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    this.work_load_data = [];
    // this.work_load_data.push(this.arrangeShiftdefintionG)
    for (var i = 0; i < this.arrangeShiftdefintionG.length; i++) {
      this.work_load_data.push(this.arrangeShiftdefintionG[i]);
    }
    for (var i = 0; i < this.arrangeShiftdefintionL.length; i++) {
      this.work_load_data.push(this.arrangeShiftdefintionL[i]);
    }

    for (var i = 0; i < this.work_load_data.length; i++) {
      // this.shift_name=this.allShiftData[i].sh_name
      if (this.work_load_data[i].shiftName != null) {
        // this.allShiftName.push({"shift_name":this.work_load_data[i].shiftName,"startTime": this.work_load_data[i].startTime,"shiftPattern": 'M'+ this.work_load_data[i].startTime})
        if (
          Number(this.work_load_data[i].startTime) > 2200 ||
          Number(this.work_load_data[i].startTime) < 600
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'M' + this.work_load_data[i].startTime,
          });
        } else if (
          Number(this.work_load_data[i].startTime) > 500 &&
          Number(this.work_load_data[i].startTime) < 1300
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'D' + this.work_load_data[i].startTime,
          });
        } else if (
          Number(this.work_load_data[i].startTime) > 1200 &&
          Number(this.work_load_data[i].startTime) < 2300
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'E' + this.work_load_data[i].startTime,
          });
        }
      }
    }

    this.localData.setItem(
      'allShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.localData.setItem('outliers', JSON.stringify([]));
    this.loginForm.reset();

    var user_data = JSON.parse(sessionStorage.getItem('userData'));

    await this.loading.dismiss();
    if (user_data.role == 'bidmanager' || user_data.role == 'emp') {
      this.navCtrl.navigateForward([straightlines_io_apis.apis.dashboard]);
    } else {
      this.navCtrl.navigateForward([
        straightlines_io_apis.apis.guest_dashboard,
      ]);
    }
  }
  async allDefaultShiftdata() {
    this.allll = [];
    this.allShiftData = JSON.parse(this.localData.getItem('allShift'));

    this.test1 = { sh_name: null };
    this.localData.setItem('newSHiftDefinition', JSON.stringify(this.test1));
    this.work_load_data = [];
    for (var i = 0; i < this.default_work_load_data.length; i++) {
      this.work_load_data.push(this.default_work_load_data[i]);
    }

    this.arrangeShiftdefintionG = [];
    this.arrangeShiftdefintionL = [];
    for (var i = 0; i < this.work_load_data.length; i++) {
      if (Number(this.work_load_data[i].startTime) > 2200) {
        this.arrangeShiftdefintionG.push(this.work_load_data[i]);
      } else if (Number(this.work_load_data[i].startTime) <= 2200) {
        this.arrangeShiftdefintionL.push(this.work_load_data[i]);
      }
    }
    this.arrangeShiftdefintionG.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    this.arrangeShiftdefintionL.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    this.work_load_data = [];
    // this.work_load_data.push(this.arrangeShiftdefintionG)
    for (var i = 0; i < this.arrangeShiftdefintionG.length; i++) {
      this.work_load_data.push(this.arrangeShiftdefintionG[i]);
    }
    for (var i = 0; i < this.arrangeShiftdefintionL.length; i++) {
      this.work_load_data.push(this.arrangeShiftdefintionL[i]);
    }

    for (var i = 0; i < this.work_load_data.length; i++) {
      // this.shift_name=this.allShiftData[i].sh_name
      if (this.work_load_data[i].shiftName != null) {
        // this.allShiftName.push({"shift_name":this.work_load_data[i].shiftName,"startTime": this.work_load_data[i].startTime,"shiftPattern": 'M'+ this.work_load_data[i].startTime})
        if (
          Number(this.work_load_data[i].startTime) > 2200 ||
          Number(this.work_load_data[i].startTime) < 600
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'M' + this.work_load_data[i].startTime,
          });
        } else if (
          Number(this.work_load_data[i].startTime) > 500 &&
          Number(this.work_load_data[i].startTime) < 1300
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'D' + this.work_load_data[i].startTime,
          });
        } else if (
          Number(this.work_load_data[i].startTime) > 1200 &&
          Number(this.work_load_data[i].startTime) < 2300
        ) {
          this.allShiftName.push({
            id: i + 1,
            shift_name: this.work_load_data[i].shiftName,
            startTime: this.work_load_data[i].startTime,
            shiftPattern: 'E' + this.work_load_data[i].startTime,
          });
        }
      }
    }

    this.localData.setItem(
      'allShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.localData.setItem(
      'updatedallShiftRequiredData',
      JSON.stringify(this.work_load_data)
    );
    this.localData.setItem('outliers', JSON.stringify([]));
    this.loginForm.reset();

    var user_data = JSON.parse(sessionStorage.getItem('userData'));

    await this.loading.dismiss();
    if (user_data.role == 'bidmanager') {
      this.navCtrl.navigateForward([straightlines_io_apis.apis.dashboard]);
    } else {
      this.navCtrl.navigateForward([
        straightlines_io_apis.apis.guest_dashboard,
      ]);
    }
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
      return 'password app-font-primary-color  border-2px-solid form-control ion-no-margin ion-no-padding';
    } else if (0 != cId) {
      return 'app-font-primary-color border-2px-solid form-control ion-no-margin ion-no-padding';
    }
  }
}
