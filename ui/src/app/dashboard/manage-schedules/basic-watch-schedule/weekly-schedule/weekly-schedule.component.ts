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
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.scss'],
})
export class WeeklyScheduleComponent implements OnInit {
  viewMode: string;
  weekly_time_data: string[] = [];
  weekly_date_data: string[] = [];
  weekly_table_data:object[][][] = [];
  weekly_table_data_rdo:object[][] = [];
  immutable_weekly_table_data: object[][][] = [];
  immutable_emp_weekly: any;
  sub: Subscription;
  overlayRef: OverlayRef | null;
  @ViewChild('weeklyMenu') userMenu: TemplateRef<any>;

  @Input() current_bid_schedule_data;
  @Input() allEmplListWeekly;
  @Input() weeklybasicWatchVacation;
  @Input() startDate;
  @Input() endDate;
  @Input() selectedDate:any;
  @Input() bidScheduleID:any;
  currentDate 
  duration: number;
  bidscheduleid: string;
  count =1;
  
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
    if (this.count == 1) {
        
      this.immutable_emp_weekly = this.allEmplListWeekly;
    }
    this.count = 2;
    this.currentDate = moment(new Date()).format('YYYY-MM-DD');
    this.allEmplListWeekly = this.allEmplListWeekly.sort((a, b) => 
                                                      a.time - b.time
                                                    ).sort((a, b) => {
                                                      return (Number(a.time) >= 2300) ? -1 : 1
                                                    });
    // console.log('this.all==', this.allEmplListWeekly);
    this.allEmplListWeekly.forEach((data) => {
      if (this.weekly_time_data.indexOf(data.time) === -1) {
        this.weekly_time_data.push(data.time)
      }
    });
    // this.allEmplListWeekly.forEach((data) => {
    //   if (this.weekly_date_data.indexOf(data.date) === -1) {
    //     this.weekly_date_data.push(data.date)
    //   }
    // });
    this.weekly_date_data = this.getDates(this.startDate, this.endDate);
    
    let tmpTableArray: object[][][] = [];
    let tmpTableArrayRdo: object[][][] = [];
    this.weekly_time_data.forEach((time) => {
      let tmpArr: object[][] = [];
     
      this.weekly_date_data.forEach((date) => {
        let result = this.allEmplListWeekly.filter((data) => data.date === date && data.time === time && !data.rdoDayOff);
        if (result.length > 0) { tmpArr.push(result)}
        else tmpArr.push([]);
      });
      

      tmpTableArray.push(tmpArr);
     
    });
    let tmpArrRdo: object[][] = [];
    this.weekly_date_data.forEach((date) => {
      let result_rdo = this.allEmplListWeekly.filter((data) => data.date === date && data.rdoDayOff);
      if (result_rdo.length > 0) { tmpArrRdo.push(result_rdo)}
    })
    this.weekly_table_data = tmpTableArray;
    
    this.weekly_table_data_rdo = tmpArrRdo;
    this.immutable_weekly_table_data = this.cloneDeepArray(tmpTableArray);
  }

  drop(event: CdkDragDrop<any>, time: string, date: string) {
    console.log('event1==', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data[event.previousIndex].time = time
      event.previousContainer.data[event.previousIndex].date = date
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
        event.currentIndex);
      console.log('event2==', event);
        this.checkRule(event.container.data[event.currentIndex]);

    }
  }

  getStatus(time: string) {
    let num_time = Number(time);
    if (num_time >=1300 && num_time <= 2100) {
      return 2;
    }
    if (num_time >= 500 && num_time <= 1200) {
      return 0;
    }
    return 1;
  }

   getDates(startDate, endDate) {
    const dates = [];
     let currentDate = new Date(startDate);
     currentDate.setDate(currentDate.getDate() + 1);
     let end_date = new Date(endDate);
     end_date.setDate(end_date.getDate() + 1);
    while (currentDate <= end_date) {
      dates.push(moment(new Date(currentDate)).format('YYYY-MM-DD'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  getCount(index: number) {
    let count = 0;
    this.weekly_table_data[index].forEach(item => {
       count +=item.length
     }
    )
    return count
  }
  getCountImmutable(index: number) {
    let count = 0;
    this.immutable_weekly_table_data[index].forEach(item => {
       count +=item.length
     }
    )
    return count
  }

  getDateCount(index:number) {
    let count = 0;
    this.weekly_table_data.forEach(item => {
      count += item[index].length
    })
    return count
  }
  
  getDateCountImmutable(index:number) {
    let count = 0;
    this.immutable_weekly_table_data.forEach(item => {
      count += item[index].length
    })
    return count
  }

  isFilled(item:any,ind1: number, ind2: number, id:number) {
    var status = true;
    this.immutable_weekly_table_data[ind1][ind2].map((data,index) => {

        if (data['id'] === item['id']) {
          status = false;
        }
      
    });
    
    return status;
  }

  getWeekDate() {
    return `${moment(this.weekly_date_data[0]).format("ddd, MMM D, yyyy")} ~ ${moment(this.weekly_date_data[this.weekly_date_data.length-1]).format("ddd, MMM D, yyyy")}`
  }

  reset() {
    console.log('this.immutable_emp_weekly==',this.immutable_emp_weekly)
    this.allEmplListWeekly=this.immutable_emp_weekly
    this.weekly_table_data = this.immutable_weekly_table_data;
    this.immutable_weekly_table_data = this.cloneDeepArray(this.immutable_weekly_table_data);
    // this.ngOnInit()
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

  async checkRule(data) {
    let temp = [];
    const databyempid = this.allEmplListWeekly.filter((item) => item.empid == data.empid);
    databyempid.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let date = "";
    let rule = [];
    databyempid.forEach(item => {
      if (date == item.date) {
        if (item.rdoDayOff == 'X') {
          temp.push(item.time);
        } else {
          
          rule = ["Do not work more than 10 operational hours in a shift"];
        }
        
      } else {
        if (item.rdoDayOff == 'X') {
          item.time = 'X'
          temp.push(item.time)
        } else {
          // if (item.date == data.date) {
          //   item.time = time;
          // }
          temp.push(item.time.toString().padStart(4, '0'))
          
        }
        date = item.date;
      }
    });
    const shift_line = {
      "shift_line": temp,
      "shift_length": 8,
      "date":data.date,
      "bidscheduleid":data.bidscheduleid,
      "empid":data.empid,
      "time":data.time,
    }
    let tempArr = [];
    try {
      
      const res: any = await this.manageSchedule.checkPayperiodAndBusinessRule(shift_line).toPromise();
      for (let i = 0; i < this.allEmplListWeekly.length; i++) {
        const element =  this.allEmplListWeekly[i];
        if (element.id == data.id) {
          element.rule =res
        }
        
        tempArr.push(element);
        
      }
    } catch (error) {
      for (let i = 0; i < this.allEmplListWeekly.length; i++) {
        const element =  this.allEmplListWeekly[i];
        if (element.id == data.id) {
          
            
            element.rule = rule
         
        }
        
        tempArr.push(element);
        
      }
    }
    // this.allEmplListWeekly = tempArr;
    // this.allEmployeeListNewService = tempArr
    // return res?.business_rules
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
