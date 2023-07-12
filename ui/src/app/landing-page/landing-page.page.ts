import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { RegistrationService } from 'src/app/services/registration.service';
import Swal from 'sweetalert2';
import { PhoneVerificationService } from 'src/app/services/phone-verification/phone-verification.service';
import { TrialPeriodService } from '../services/trial-period.service';
import { RequestDemoService } from '../services/request-demo/request-demo.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestDemoModelComponent } from './request-demo-model/request-demo-model.component';
import { StartMyFreeTrialComponent } from './start-my-free-trial/start-my-free-trial.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
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
    private requestDemoSer:RequestDemoService,
    public loadingController: LoadingController,
    private PV:PhoneVerificationService,
    private trialPeriodSer:TrialPeriodService,
    private EV:EmailValidationService) { }

  ngOnInit() {

  }
  aboutUs(){
  }
  watchVideo(){

  }

  closeResult = '';
  open() {
    const dialogRef = this.dialog.open(StartMyFreeTrialComponent, {
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: 0${reason}`;
    }
  }



  openDemo(){
    const dialogRef = this.dialog.open(RequestDemoModelComponent, {
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
