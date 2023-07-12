import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import moment from 'moment';
import * as appReducer from '../../../../../store/app.reducers';
import * as AdminActions from '../../../store/admin.actions';
import { AlertController, ModalController } from '@ionic/angular';
import { UserShftServicesService } from 'src/app/services/user-shift-service/user-shft-services.service';
import { UpdateEmployeeComponent } from '../../employees/update-employee/update-employee.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';

interface Roles {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-user-shift',
  templateUrl: './add-user-shift.component.html',
  styleUrls: ['./add-user-shift.component.scss']
})
export class AddUserShiftComponent implements OnInit {
  addFunctionName;
  user_data;
  addSuccess = false;
  modal_data
  facilityTypesName;
  shiftCategory
  shiftTimeExixt 
  userShiftForm = new FormGroup({
    user_shift_area: new FormControl('', Validators.required),
    user_shift_name: new FormControl('', Validators.required),
    shiftNames: new FormControl(''),
    user_shift_category: new FormControl('', Validators.required),
    user_shift_duration: new FormControl('', Validators.required),
    user_shift_start_time: new FormControl('', Validators.required),
    user_shift_end_time_dom_show: new FormControl({
      value: '',
      disabled: true,
    }),
    user_shift_end_time: new FormControl(),
    user_shift_activation_date: new FormControl('', Validators.required),
    user_shift_expiration_date: new FormControl('', Validators.required),
    checkExIn: new FormControl('',Validators.required),
  });
  existMassage 
  userShiftList : any = []
  minDate = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<appReducer.AppState>,
    public dialog: MatDialog,
    private userShiftService: UserShftServicesService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateEmployeeComponent>,
    private localData: LocalDataService
  ) {
    this.modal_data = data;
    this.addFunctionName = data.addName;
    this.store.dispatch(new AdminActions.Clear());
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    if (data.addName === 'Facility') {
      this.store.dispatch(new AdminActions.GetFacilityTypes());
      this.store.dispatch(new AdminActions.GetFacilityTypes());
    }
  }

  Roles: Array<Roles> = [
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
    { value: 'TOWER', viewValue: 'TOWER' },
    { value: 'TRACOR', viewValue: 'TRACOR' },
  ];

  durations = [8,9,10];

  area
  shift_category: any = []
  ngOnInit(): void {
    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.addSuccess) {
        this.addSuccess = authdata.addSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
    });

    this.userShiftForm.patchValue({
      user_shift_end_time:
        parseInt(this.userShiftForm.value.user_shift_duration) * 100 +
        this.userShiftForm.value.user_shift_start_time,
    });

    this.userShiftService.getAreaNames().subscribe(res => {
      
      this.area = res.sort((a, b) => (a.areaname > b.areaname) ? 1 : -1);
    })
    this.userShiftService.getAllShiftCategoryNames().subscribe(res => {
      
      this.shift_category = res.sort((a, b) => (a.shcategory_name > b.shcategory_name) ? 1 : -1);
    })
    this.userShiftService.checkAliasByUserId(this.user_data.id).subscribe( res => {
      this.userShiftList = res
      this.userShiftList.push('M')
      this.userShiftList.push('N')
      this.userShiftList.push('X')
      this.getallShiftName()
      this.checkShiftCategory()
    })
  }


  addUserShift() {
    let userShiftData = {
      sh_name:this.userShiftForm.controls.user_shift_name.value,
      sh_category_id:this.userShiftForm.controls.user_shift_category.value.shcategory_id,
      sh_category_name_ref: this.userShiftForm.controls.user_shift_category.value.shcategory_name,
      sh_starttime:this.userShiftForm.controls.user_shift_start_time.value + ':00',
      sh_endtime:this.convertTimeTo24(this.userShiftForm.controls.user_shift_end_time_dom_show.value)+':00',
      // sh_priority:'2',
      sh_activation_date:moment(this.userShiftForm.controls.user_shift_activation_date.value).format("YYYY-MM-DD"),
      sh_expiration_date:moment(this.userShiftForm.controls.user_shift_expiration_date.value).format("YYYY-MM-DD"),
      sh_include_exclude:this.userShiftForm.controls.checkExIn.value,
      sh_area_id:this.userShiftForm.controls.user_shift_area.value.areaid,
      area_name_ref:this.userShiftForm.controls.user_shift_area.value.areaname,
      sh_duration:this.userShiftForm.controls.user_shift_duration.value,
      sh_created_by:this.user_data.id,
    } 
    this.userShiftService.AddShiftDefinitionByUserID(userShiftData).subscribe(res => {
      this.massageModal(res)
    }, (errr) => {
    }, ()=> {})
  }
  async massageModal(res){
    this.matDialog.closeAll();
    this.dialogRef.close(res)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'User Shift Added Successfully!',
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
  getEndTime(s, d, format = 12) {
    let data = +s + +d * 100;
  if (data > 2400) {
    data -= 2400;
  }

  if (format === 12) {
    const hours = Math.floor(data / 100);
    const minutes = data % 100;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else {
    return data.toString().padStart(4, '0');
  }
  }
  somethingChanged() {
    if(this.userShiftForm.value.user_shift_start_time){
      this.userShiftForm.patchValue({
        user_shift_end_time_dom_show: this.getEndTime(this.convertTimeFormat(this.userShiftForm.value.user_shift_start_time),this.userShiftForm.value.user_shift_duration)
      });
      // if(this.userShiftForm.value.user_shift_start_time && this.userShiftForm.value.user_shift_duration){
      //   this.userShiftService.checkShiftLine(this.user_data.id,this.userShiftForm.controls.user_shift_name.value,this.userShiftForm.controls.user_shift_duration.value,this.userShiftForm.controls.user_shift_start_time.value+':00').subscribe(res => {
      //     this.shiftTimeExixt = res
      //   })
      // }
      
      this.checkShiftCategory()

      this.checkShiftTimeExistOrNot()
    }
    
  }
  close() {
    this.store.dispatch(new AdminActions.Clear());
  }
  convertTimeTo24HrFormat(time) {
    let timedata = time+'00'
    const hours = parseInt(timedata.slice(0, 2));
    const minutes = parseInt(timedata.slice(2, 4));
    const seconds = parseInt(timedata.slice(4, 6));
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return formattedTime;
  }
   convertTimeFormat(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const formattedTime = hour + minute;
    return formattedTime;
  }
  startTime(s) {
    let data = s;
    if (data > 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }
  getStartHour(timeString) {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return formattedHours + formattedMinutes;
  }

  allShiftName
  allShiftData
  allShiftDefintions
  
  addnewShiftDefinition
  start_time
  shift_duration
  dateParsed
  private date = new Date();
  getallShiftName(){
    this.allShiftData = JSON.parse(this.localData.getItem('allShift'));

    this.allShiftName = [];
    if (this.allShiftData != null) {
      for (var i = 0; i < this.allShiftData.length; i++) {
        if (this.allShiftData[i].sh_name != null) {
          this.allShiftDefintions.push({
            startTime:
              this.allShiftData[i].sh_starttime.split(':')[0] +
              this.allShiftData[i].sh_starttime.split(':')[1],
            sh_duration: this.allShiftData[i].sh_duration,
          });
          this.allShiftName.push(this.allShiftData[i].sh_name);
        }
      }
    }
    this.allShiftName = this.removeExistingObjects(this.populateLetters(),this.userShiftList).filter(
      (val) => !this.allShiftName.includes(val)
    );
    if (this.allShiftName.length > 0) {
      this.userShiftForm.patchValue({
        user_shift_name :  this.allShiftName[0],
        shiftNames: this.allShiftName[0]
      }) 
    } else {
      this.addnewShiftDefinition = 'N/A';
    }
    
  }
 
  populateLetters() {
    const letters = {};
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      if (letters[letter]) {
        let count = 1;
        while (letters[letter + count]) {
          count++;
        }
        letters[letter + count] = true;
      } else {
        letters[letter] = true;
      }
    }
    
    return Object.keys(letters);
  }


  removeExistingObjects(arr1, arr2) {
    return arr1.filter(obj1 => !arr2.some(obj2 => obj1 === obj2));
  }

  
checkShiftTimeExistOrNot(){
  let shiftStartTime = this.userShiftForm.controls.user_shift_start_time.value 
  let shiftduration = this.userShiftForm.controls.user_shift_duration.value
  let areaid = this.userShiftForm.controls.user_shift_area.value.areaid
  if(this.user_data.id && shiftStartTime && shiftduration && areaid){
    this.userShiftService.checkShiftDuration(this.user_data.id, shiftStartTime+ ':00', shiftduration, areaid).subscribe( 
      res => {
      this.shiftTimeExixt = res 
    },
    error => {
        
      if (error.error.text.includes('new')) {
        this.shiftTimeExixt = "";
        // this.time_valid = true;
      } else {
        this.shiftTimeExixt = error.error.text;
        // this.time_valid = false;
      }
    })
  }
}

  checkShiftCategory(){
    const startHour = this.getStartHour(this.userShiftForm.value.user_shift_start_time+':00');
    const endHour = this.getStartHour( this.getEndTime(this.convertTimeFormat(this.userShiftForm.value.user_shift_start_time),this.userShiftForm.value.user_shift_duration));
    // console.log(startHour, endHour)
      if (startHour >= 2200 || startHour < 400) {
        this.shiftCategory = "MID";
      }
      else if (startHour >= 400 && startHour < 1200) {
        this.shiftCategory = "DAY";
      } else if (startHour >= 1200 && startHour < 2200) {
        this.shiftCategory = "EVE";
      }
      this.userShiftForm.patchValue({
        user_shift_category: this.shiftCategory
      });
      const filteredShiftCategories = this.shift_category.filter(category => category.shcategory_name === 'MID');
      this.userShiftForm.patchValue({
        user_shift_category: filteredShiftCategories[0]
      })
      }

      convertTimeTo24(timeString) {
        let time = timeString.split(' ');
        let hours = Number(time[0].split(':')[0]);
        let minutes = Number(time[0].split(':')[1]);
      
        if (time[1] === 'PM' && hours !== 12) {
          hours += 12;
        } else if (time[1] === 'AM' && hours === 12) {
          hours = 0;
        }
      
        let hoursString = hours.toString().padStart(2, '0');
        let minutesString = minutes.toString().padStart(2, '0');
      
        return `${hoursString}:${minutesString}`;
      }
}
