import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  MaxLengthValidator,
  ControlValueAccessor,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { max } from 'moment';
import { EmployeeService } from 'src/app/services/employee/employee.service';

import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';
import { MyTel } from '../form-field-custom-control-example/form-field-custom-control-example.component';

interface Roles {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: AddEmployeeComponent },
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class AddEmployeeComponent implements OnInit {
  allData;
  modalName;
  initalCheck;
  isemailCheck;
  FacilityArea;
  addEmployssSuccess;
  user_data;
  addSuccess = false;
  modal_data;
  facilityTypesName;
  allEmployee;
  maximumRank;
  phoneNumberFromChild = '';
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
  Facility
  FacilityAreaList
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>,
    private empService: EmployeeService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<AddEmployeeComponent>
  ) {
    this.modal_data = data;
    this.modalName = data.addName;
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
  }

  ngOnInit(): void {
    this.store.dispatch(
      new AdminActions.GetAllEmployeesBasedOnUserId(this.user_data.id)
    );
    this.store.dispatch(new AdminActions.GetAllQualification());
    this.store.dispatch(new AdminActions.GetAllRoles());
    this.store.dispatch(new AdminActions.GetAllFacility());

    this.store.select('adminStore').subscribe((authdata) => {
      this.allData = authdata;
      this.initalCheck = authdata.initalCheck;
      this.isemailCheck = authdata.emailCheck;
      this.addEmployssSuccess = authdata.addEmployssSuccess;
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
      if (this.allData.emloyees.length > 0) {
        this.allEmployee = this.allData.emloyees.sort(
          (a, b) => a.rank - b.rank
        );
        var tempArr = [];
        for (var i = 0; i < this.allEmployee.length; i++) {
          tempArr.push(this.allEmployee[i].rank);
        }

        this.maximumRank = tempArr.reduce(function (a, b) {
          return Math.max(a, b);
        });
        this.employeeForm.patchValue({
          seniority: this.maximumRank + +(+1),
        });
      }
      this.FacilityAreaList = authdata.FacilityArea.sort((a, b) => {
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
    });
  }
  receiveAutoMsgHandler(p) {
    this.phoneNumberFromChild = p.area + p.exchange + p.subscriber;
    this.employeeForm.patchValue({
      phone: this.phoneNumberFromChild,
    });
  }
  getAreaByFacility(e) {
    this.store.dispatch(new AdminActions.GetFacilityArea(e.value));
  }
  getArea(e) {
    this.employeeForm.patchValue({
      area: e.value,
    });
  }
  checkInitialName() {
    let initial = this.employeeForm.controls.initials.value;
    this.store.dispatch(
      new AdminActions.GetInitialCheck({
        managerid: this.user_data.id,
        initial: initial,
      })
    );
  }
  emailCheck() {
    let email = this.employeeForm.controls.email.value;
    this.store.dispatch(new AdminActions.GetEmailCheck({ Email: email }));
  }
  addUserShift() {
    var new_emp = {
      fname: this.employeeForm.controls.fname.value,
      lname: this.employeeForm.controls.lname.value,
      initials: String(this.employeeForm.controls.initials.value).toUpperCase(),
      rank: Number(this.employeeForm.controls.seniority.value),
      phone: this.phoneNumberFromChild,
      email: this.employeeForm.controls.email.value,
      qualification: this.employeeForm.controls.qualification.value,
      role: this.employeeForm.controls.role.value,
      managerid: this.user_data.id,
      vacation: this.employeeForm.controls.vacation.value,
      emailsent: 0,
      accumulatedleave: this.employeeForm.controls.accumulatedleave.value,
      areaid: this.employeeForm.controls.area.value,
    };
    if (
      this.addEmployssSuccess &&
      this.initalCheck != 'Initials Exist' &&
      this.isemailCheck != 'email exists!'
    ) {
      this.store.dispatch(
        new AdminActions.GetInitialCheck({
          managerid: this.user_data.id,
          initial: String(
            this.employeeForm.controls.initials.value
          ).toUpperCase(),
        })
      );
      this.store.dispatch(
        new AdminActions.GetEmailCheck({
          Email: this.employeeForm.controls.email.value,
        })
      );
      if (
        this.initalCheck != 'Initials Exist' &&
        this.isemailCheck != 'email exists!'
      ) {
        this.addFucntion(new_emp);
      }
    } else {
      this.addFucntion(new_emp);
    }
  }
  addFucntion(new_emp) {
    this.empService.addNewEmployee(new_emp).subscribe((res) => {
      this.massageModal(res);
    });
  }
  async massageModal(res) {
    this.matDialog.closeAll();
    this.dialogRef.close(res);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'Employee Added Successfully!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.modalCtrl.dismiss();
          },
        },
      ],
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
}
