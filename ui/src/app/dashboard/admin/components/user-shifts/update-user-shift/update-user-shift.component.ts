import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as appReducer from '../../../../../store/app.reducers';

import * as AdminActions from '../../../store/admin.actions';
import { UserShftServicesService } from 'src/app/services/user-shift-service/user-shft-services.service';
import moment from 'moment';
import { AlertController, ModalController } from '@ionic/angular';
import { UpdateEmployeeComponent } from '../../employees/update-employee/update-employee.component';
import { LocalDataService } from 'src/app/services/data/local-data.service';


@Component({
  selector: 'app-update-user-shift',
  templateUrl: './update-user-shift.component.html',
  styleUrls: ['./update-user-shift.component.scss'],
})
export class UpdateUserShiftComponent implements OnInit {
  updateData;
  resetData;
  editName;
  user_data;
  updateSuccess = false;
  facilityTypesName;
  selected;
  shiftTimeExixt 
  shiftCategory
  userShiftList : any = []
  userShiftForm = new FormGroup({
    user_shift_area: new FormControl('', Validators.required),
    user_shift_name: new FormControl('', Validators.required),
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
  });

  user_shift_name = this.userShiftForm.controls['user_shift_name'];
  user_shift_area = this.userShiftForm.controls['user_shift_area'];
  user_shift_category = this.userShiftForm.controls['user_shift_category'];
  user_shift_duration = this.userShiftForm.controls['user_shift_duration'];
  system_shift_start_date = this.userShiftForm.controls['start_date'];
  system_shift_end_date = this.userShiftForm.controls['end_date'];
  durations = [8,9,10];


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
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.updateData = data.dataKey;
    this.resetData = data.dataKey;
    this.editName = data.editName;

   
    this.userShiftForm.patchValue({
      user_shift_area: this.updateData.sh_area_id,
      user_shift_name: this.updateData.sh_name,
      user_shift_duration: this.updateData.sh_duration,
      user_shift_activation_date: moment(this.updateData.sh_activation_date).format('YYYY-MM-DD'),
      user_shift_start_time: this.updateData.sh_starttime,
      user_shift_category:  this.updateData.sh_category_id,
      user_shift_expiration_date: moment(this.updateData.sh_expiration_date).format('YYYY-MM-DD'),
      user_shift_end_time_dom_show: this.formatTime24to12(this.updateData.sh_endtime)
    });
  }
  area

  shift_category : any = []
  getStartHour(timeString) {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return formattedHours + formattedMinutes;
  }
  ngOnInit(): void {

    this.store.select('adminStore').subscribe((authdata) => {
      if (!this.updateSuccess) {
        this.updateSuccess = authdata.updateSuccess;
        this.facilityTypesName = authdata.FacilityTypes;
      }
    });

    this.userShiftService.getAreaNames().subscribe(res => {
      this.area = res.sort((a, b) => (a.areaname > b.areaname) ? 1 : -1);
    })
    this.userShiftService.getAllShiftCategoryNames().subscribe(res => {
      this.shift_category = res.sort((a, b) => {
        if (!a.shcategory_name || !b.shcategory_name) {
          return 0;
        }
        return a.shcategory_name.localeCompare(b.shcategory_name);
      });;
      this.shift_category
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

  resetcf() {

    if (this.editName === 'User Shift') {
      this.userShiftForm.patchValue({
        user_shift_area: this.updateData.sh_area_id,
        user_shift_name: this.updateData.sh_name,
        user_shift_duration: this.updateData.sh_duration,
        user_shift_activation_date: moment(this.updateData.sh_activation_date).format('YYYY-MM=DD'),
        user_shift_start_time: this.updateData.sh_starttime,
        user_shift_category:  this.updateData.sh_category_id,
        user_shift_expiration_date: moment(this.updateData.sh_expiration_date).format('YYYY-MM=DD'),
        user_shift_end_time_dom_show: this.formatTime24to12(this.updateData.sh_endtime)
      });
    }
  }
  close() {
    // this.store.dispatch(new AdminActions.Clear());
  }

  updateUserShift() {
    let userShiftData = {
      sh_id:this.updateData.sh_id,
      sh_name:this.userShiftForm.controls.user_shift_name.value,
      sh_category_id:this.userShiftForm.controls.user_shift_category.value.shcategory_id,
      sh_category_name_ref: this.userShiftForm.controls.user_shift_category.value.shcategory_name,
      sh_starttime:this.userShiftForm.controls.user_shift_start_time.value+':00',
      sh_endtime:this.convertTimeTo24(this.userShiftForm.controls.user_shift_end_time_dom_show.value)+':00',
      sh_priority:this.updateData.sh_priority,
      sh_activation_date:moment(this.userShiftForm.controls.user_shift_activation_date.value).format("YYYY-MM-DD"),
      sh_expiration_date:moment(this.userShiftForm.controls.user_shift_expiration_date.value).format("YYYY-MM-DD"),
      sh_include_exclude:this.updateData.sh_include_exclude,
      sh_area_id:this.userShiftForm.controls.user_shift_area.value,
      area_name_ref:this.findObjectByAreaId(this.area,this.userShiftForm.controls.user_shift_area.value),
      sh_duration:this.userShiftForm.controls.user_shift_duration.value,
      created_by:this.updateData.created_by,
      created_date:this.updateData.created_date,
      updated_by:this.user_data.id, 
      sh_created_by:this.user_data.id, 
      userid:this.user_data.id, 
      updated_date:this.updateData.updated_date,
    } 
    this.userShiftService.updateShiftDefinitionByUserID(userShiftData).subscribe(res => {
      this.massageModal(res)
    }, () => {}, ()=> {})
  }
  async massageModal(res){
    this.matDialog.closeAll();
    this.dialogRef.close(res)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success',
      message: 'User Shift Updated Successfully!',
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
  convertTimeFormat(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const formattedTime = hour + minute;
    return +formattedTime;
  }
  checkShiftTimeExistOrNot(){
    let shiftStartTime = this.userShiftForm.controls.user_shift_start_time.value 
    let shiftduration = this.userShiftForm.controls.user_shift_duration.value
    let areaid = this.userShiftForm.controls.user_shift_area.value
     if(shiftStartTime+':00' == this.updateData.sh_starttime && shiftduration == this.updateData.sh_duration && areaid == this.updateData.sh_area_id){
      this.shiftTimeExixt = ''
    }else{
      if(this.user_data.id && shiftStartTime && shiftduration && areaid){
        this.userShiftService.checkShiftDuration(this.user_data.id, shiftStartTime+':00', shiftduration, areaid).subscribe( 
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
    if(shiftStartTime != this.updateData.sh_starttime || shiftduration != this.updateData.sh_duration || areaid != this.updateData.sh_area_id){

    
    }
    
  }
  somethingChanged() {
    if(this.userShiftForm.value.user_shift_start_time){
      this.userShiftForm.patchValue({
        user_shift_end_time_dom_show: this.formatTime(this.convertTimeFormat(this.userShiftForm.value.user_shift_start_time) + (100 * this.userShiftForm.value.user_shift_duration))
        
      });
      this.checkShiftCategory()
      this.checkShiftTimeExistOrNot()
    }
  }
 


  findObjectByShiftCategoryId(array, id) {
    return array.find((area) => area.shcategory_id === id).shcategory_name;
  }
   findObjectByAreaId(areaArray, areaId) {
    return areaArray.find((area) => area.areaid === areaId).areaname;
  }
  formatTime24to12(timeStr) {
    let [hours, minutes] = timeStr.split(":");
    let ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  formatTime(timeStr) {
    let hours = timeStr.toString().substring(0, 2);
    let minutes = timeStr.toString().substring(2);
    let ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
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
    this.allShiftName =  this.removeExistingObjects(this.populateLetters(),this.userShiftList).filter(
      (val) => !this.allShiftName.includes(val)
    );
    if (this.allShiftName.length > 0) {
      this.userShiftForm.patchValue({
        // user_shift_name :  this.allShiftName[0],
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
    return arr1.filter(obj1 => !arr2.some(obj2 => obj1 === obj2 && obj1 != this.updateData.sh_name ));
  }

  checkShiftCategory(){
    const startHour = this.getStartHour(this.userShiftForm.value.user_shift_start_time+':00');
    // const endHour = this.getStartHour( this.getEndTime(this.convertTimeFormat(this.userShiftForm.value.user_shift_start_time),this.userShiftForm.value.user_shift_duration));
    
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



