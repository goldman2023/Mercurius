import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { fromEvent, Subscription } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, take } from 'rxjs/operators';
import { SubmitRequestModalComponent } from '../../component/submit-request-modal/submit-request-modal.component';
import { BusinessRulesValidationService } from 'src/app/services/business-rules-validation.service';

@Component({
  selector: 'app-monthly-schedule',
  templateUrl: './monthly-schedule.component.html',
  styleUrls: ['./monthly-schedule.component.scss'],
})
export class MonthlyScheduleComponent implements OnInit {
  viewMode: string;
  monthly_table_data:object[] = [];
  sub: Subscription;
  overlayRef: OverlayRef | null;
  @ViewChild('weeklyMenu') userMenu: TemplateRef<any>;

  @Input() current_bid_schedule_data;
  @Input() allEmplListWeekly;
  @Input() monthlybasicWatchVacation;
  @Input() startDate;
  @Input() endDate;
  @Input() selectedDate:any;
  @Input() bidScheduleID:any;
  currentDate 
  allUniqueDates: any = []
  originalEmpList
  shfits: any = ['Mid','Day','Eve','RDO','Vacation']
  constructor(public dialog: MatDialog,
              private ref: ChangeDetectorRef,
              public manageSchedule: ManageScheduleService,
              public overlay: Overlay,
              public viewContainerRef: ViewContainerRef,
              public ruleValidation: BusinessRulesValidationService

    ) {
  }
  cloneDeepArray(obj: object[]) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  ngOnInit(): void {


    this.currentDate = moment(new Date()).format('YYYY-MM-DD')
    this.monthlybasicWatchVacation.forEach(info => {
      info.empinfo.forEach(emp =>{
        let data = {
          ...emp,
          areaid: 0,
          bidScheduleId: info.bidscheduleIdRef,
          date: info.dailyDate,
          duration: 0,
          empid:emp.empIdRef,
          time: null,
          rdoDayOf:null,
          managerid: info.managerIdRef,
          empinitials: emp.empInitials,
          id: Math.random()

        }
        this.allEmplListWeekly.push(data)
      })
    })
    this.originalEmpList = this.allEmplListWeekly
    this.getUniqueDates(this.allEmplListWeekly)
  }

  getUniqueDates(allEmplListWeekly) {
    let uniqueDates = new Set();
  
    allEmplListWeekly.forEach(item => {
      const date = item.date; // Assuming the date is stored under the 'date' property
      if (date) {
        uniqueDates.add(date);
      }
    });
  
    const sortedDates = Array.from(uniqueDates).sort();
  
    const firstDate = moment(sortedDates[0]);
    const lastDate = moment(sortedDates[sortedDates.length - 1]);
  
    const startDate = firstDate.startOf('week'); // Start of the week containing the first date
    const endDate = lastDate.endOf('week'); // End of the week containing the last date
  
    const datesInRange = [];
    let currentDate = startDate.clone();
  
    while (currentDate.isSameOrBefore(endDate)) {
      datesInRange.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, 'day');
    }
  
    this.allUniqueDates = datesInRange;
  }

  getWeekDates(startDate) {
    const weekDates = [];
    const startOfWeek = moment(startDate).startOf('week');
  
    for (let i = 0; i < 7; i++) {
      const currentDate = startOfWeek.clone().add(i, 'days');
      weekDates.push(currentDate.format('YYYY-MM-DD'));
    }
  
    return weekDates;
  }

  checkMonth(date1, date2) {
    const month1 = moment(date1).format('YYYY-MM');
    const month2 = moment(date2).format('YYYY-MM');
  
    return month1 === month2;
  }

  getEmployee(date,shift){
    if(shift == 'Mid'){
      return this.allEmplListWeekly.filter(emp => emp.date === date && (emp.time <= 400 || emp.time > 2100) && !emp.rdoDayOff && !emp.vacationHours)
    }
    if(shift == 'Eve'){
      return this.allEmplListWeekly.filter(emp => emp.date === date && emp.time >=1300 && emp.time <= 2100 && !emp.rdoDayOff && !emp.vacationHours)
    }
    if(shift == 'Day'){
      return this.allEmplListWeekly.filter(emp => emp.date === date && emp.time >= 500 && emp.time <= 1200 && !emp.rdoDayOff && !emp.vacationHours)
    }
    if(shift == 'RDO'){
      return this.allEmplListWeekly.filter(emp => emp.date === date && emp.rdoDayOff && !emp.vacationHours)
    }
    if(shift == 'Vacation'){
      return this.allEmplListWeekly.filter(emp => emp.date === date && emp.vacationHours)
    }
  }
  
  drop(event: CdkDragDrop<any>, date: string) {
    var arr: any = [];
    const dragedData = event.item.data
    if(dragedData.date != date ){
      this.allEmplListWeekly.forEach(element => {
        if( element.id === dragedData.id){
          if(!dragedData.update){
            const item = {
              ...dragedData,
              previousDate: dragedData.date,
              date: date,
              update: true
            }
            arr.push(item)
          }else if(dragedData.previousDate == date){
            const item = {
              ...dragedData,
              previousDate: null,
              date: date,
              update: false
            }
            arr.push(item)
          }
        }
        else{
          arr.push(element)
        }
      });
      this.allEmplListWeekly = arr;
      this.checkRule(event.item.data, date, arr);

    }
    
  }

  getStatus(item) {
    
    
    if(item.vacationHours){
      return 4;
    }if(item.rdoDayOff){
      return 3;
    }else{
      let num_time = Number(item.time);
      
      if (num_time >=1300 && num_time <= 2100 && !item.rdoDayOff) {
        return 2;
      }
      if (num_time >= 500 && num_time <= 1200 && !item.rdoDayOff) {
        return 0;
      }else{
        return 1;
      }
    }
   
  }

  isFilled(item) {
   
    if(item.update){
      return true
    }else{
      false
    }
  }


  reset() {
    this.allEmplListWeekly = this.originalEmpList
  }
 
  openDialog(empData) {
    this.detectScreenSize(empData)
  }
  detectScreenSize(empData) {
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
      this.dialog.open(EmployeeInfoComponent, {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        data: [
          {
            empData: empData,
            bidScheduleData: this.current_bid_schedule_data,
            schedule_type: 'daily',
          },
        ],
      });
    } else {
      this.dialog.open(EmployeeInfoComponent, {
        width: '1200px',
        height: '80vh',
        data: [
          {
            empData: empData,
            bidScheduleData: this.current_bid_schedule_data,
            schedule_type: 'daily',
          },
        ],
      });
    }
  }
  submitRequest(emp) {
    const dialogRef = this.dialog.open(SubmitRequestModalComponent, {
      width: '822px',
      height: '77vh',
      data: {
        ...emp,
        bidScheduleId: this.bidScheduleID
      }
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  getTooltime(l,f){
    return l+', '+f;
  }

  getStartHour(timeString) {
    return timeString.toString().padStart(4, '0');;
  }

  async checkRule(data, time, arr) {
   const startdate =moment( time).startOf('week').format('YYYY-MM-DD')
    const enddate = moment(time).endOf('week').format('YYYY-MM-DD')
    let temp = [];
    const databyempid = this.allEmplListWeekly.filter((item) => 
    item.empid == data.empid && 
    new Date(item.date) >= new Date(startdate) && 
    new Date(item.date) <= new Date(enddate)
    );   
    
    databyempid.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    databyempid.forEach(item => {
      if (item.rdoDayOff == 'X') {
        item.time = 'X'
        temp.push(item.time)
      } else {
        if (item.date == time) {
          item.time = data.time;
        }
        temp.push(item.time.toString().padStart(4, '0'))
        
      }
    })
    const shift_line = {
      "shift_line": temp,
      "shift_length": 8,
      "date":time,
      "bidscheduleid":data.bidscheduleid,
      "empid":data.empid,
      "time":data.time,
    }
    let tempArr = [];
    if (temp.length == 7) {
      
      const res: any = await this.manageSchedule.checkPayperiodAndBusinessRule(shift_line).toPromise();
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == data.id) {
          element.rule = res
        }
        tempArr.push(element);
        
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == data.id) {
          element.rule = ['Employee should not wok for more or less than 80 hours in a pay period']
        }
        tempArr.push(element);
        
      }
      
    }
    // this.allEmployeeListNewService = tempArr
    // return res?.business_rules
  }
detectScreen(){
    const screenWidth = window.innerWidth;
    return (screenWidth > 768) ? true : false;
}
  stickyNotes = false
  clientX
  clientY
  stickyDetails
  noteEmpIdAndDate
  stickyNote(item , event, date){
    const screenWidth = window.innerWidth;
    this.noteEmpIdAndDate ={
      date : date,
      empId : item.empid
    }
    this.stickyDetails =item
    this.stickyNotes = true
    if ( screenWidth > 768) {
      const { clientX, clientY } = event;
      this.clientX = clientX - 50
    this.clientY = clientY - 14
    }
  }

  closeSticky(value: boolean) {
    this.stickyNotes = value
  }
}
