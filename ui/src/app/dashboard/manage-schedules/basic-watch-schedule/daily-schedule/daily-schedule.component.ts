import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { fromEvent, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { SubmitRequestModalComponent } from '../../component/submit-request-modal/submit-request-modal.component';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { StickyNoteComponent } from 'src/app/shared/component/sticky-note/sticky-note.component';
import { CommonService } from 'src/app/shared/common.service';


@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss'],
})
export class DailyScheduleComponent implements OnInit {
  empid: any;
  duration: any;
 
  @Input() weekDates;
  @Input() endDate;
  @Input() startDate;
  @Input() dailyWorkForce: any = [];
  @Input() vacationWatchSchedule: any = [];
  @Input() allEmployeeListNewService: any = [];
  @Input() current_bid_schedule_data;
  @Input() selectedDate: any;
  @Input() allEmplListWeekly: any = [];

  @Input() bidScheduleID: any;
  rdosEmpInitialsList: any = [];
  default_empList: any = [];
  currentDate
  @ViewChild('userMenu') userMenu: TemplateRef<any>;

  overlayRef: OverlayRef | null;
  bidscheduleid: string;
  bidScheduleId: string;
  noteUpdate = false
  message
  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    public manageSchedule: ManageScheduleService,
    public dataService: CommonService
  ) {}

  ngOnInit(): void {
    this.default_empList = this.allEmployeeListNewService;
    this.weekDates = [this.weekDates];
    this.currentDate = moment(new Date()).format('YYYY-MM-DD')
    this.dataService.getData().subscribe(async data => {
      this.noteUpdate = true
      this.message = data
  });
  }
  

  reset() {
    this.allEmployeeListNewService = this.default_empList;
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
  openDialog(empData) {
    this.detectScreenSize(empData)
  }

  getDragandDropColor(category, updated, w) {
    if (updated) {
      return 'app-font-white-color move-drag-drop';
    } else {
      return 'app-font-primary-color move-drag-drop';
    }
  }
  getBorderColorForDragandDropShiftCategory(shiftTime, updated, w) {
    if (updated) {
      if (2200 <= shiftTime || shiftTime <= 400) {
        return 'mid-category-bg-color app-padding-margin-0 mid-category-border-color-color';
      } else if (shiftTime >= 500 && shiftTime <= 1200) {
        return 'day-category-bg-color app-padding-margin-0 day-category-border-color-color';
      } else if (shiftTime >= 1300 && shiftTime <= 2100) {
        return 'eve-category-bg-color app-padding-margin-0 eve-category-border-color-color';
      } else {
        return 'app-padding-margin-0';
      }
    } else {
      if (2200 <= shiftTime || shiftTime <= 400) {
        return 'mid-category-border-color-color';
      } else if (shiftTime >= 500 && shiftTime <= 1200) {
        return 'day-category-border-color-color';
      } else if (shiftTime >= 1300 && shiftTime <= 2100) {
        return 'eve-category-border-color-color';
      } else {
        return '';
      }
    }
  }
  async drop(event: CdkDragDrop<string[]>, shiftTime) {
    var arr: any = [];
    if (shiftTime != event.item.data.time) {
      for (var i = 0; i < this.allEmployeeListNewService.length; i++) {
        if (this.allEmployeeListNewService[i].id == event.item.data.id) {
          if (event.item.data.updated) {
            if (event.item.data.default_time == shiftTime) {
              const { default_time, ...dataWithoutDefaultTime } =
                event.item.data;
              arr.push({
                ...dataWithoutDefaultTime,
                time: shiftTime,
                updated: false,
                rule:null
              });
            } else {
              arr.push({
                ...event.item.data,
                time: shiftTime,
                default_time: event.item.data.default_time,
                updated: true,
                // rule:rule
              });
            }
          } else {
            arr.push({
              ...event.item.data,
              time: shiftTime,
              default_time: event.item.data.time,
              updated: true,
              // rule:rule
            });
          }
        } else {
          arr.push(this.allEmployeeListNewService[i]);
        }
      }
      
      this.allEmployeeListNewService = arr;
      this.checkRule(event.item.data, shiftTime, arr);

      this.ref.detectChanges();
    }
  }

  getEmpL(wD, day, shiftTime) {
    var arr: any = [];
    for (var i = 0; i < this.allEmployeeListNewService.length; i++) {
      if (
        moment(day).format('YYYY-MM-DD') ==
        this.allEmployeeListNewService[i].date &&
        shiftTime == this.allEmployeeListNewService[i].time &&
        !this.allEmployeeListNewService[i].rdoDayOff
      ) {
        arr.push(this.allEmployeeListNewService[i]);
      }
    }
    return arr;
  }
  getRdoEmpL() {
    return this.allEmployeeListNewService.filter(
      (item) => item.rdoDayOff === 'X'
    );
  }
  getReq(wD) {
    return this.allEmployeeListNewService.filter(
      (item) => item.time === wD.shiftTime && !item.rdoDayOff
    ).length;
  }

  getBackgroundColorForShiftCategory(shiftTime) {
    if (2200 <= shiftTime || shiftTime <= 400) {
      return 'mid-category-bg-color app-padding-margin-0 mid-category-border-color-color';
    } else if (shiftTime >= 500 && shiftTime <= 1200) {
      return 'day-category-bg-color app-padding-margin-0 day-category-border-color-color';
    } else if (shiftTime >= 1300 && shiftTime <= 2100) {
      return 'eve-category-bg-color app-padding-margin-0 eve-category-border-color-color';
    } else {
      return 'app-padding-margin-0';
    }
  }
  getBorderColorForShiftCategory(shiftTime) {
    if (2200 <= shiftTime || shiftTime <= 400) {
      return 'mid-category-border-color-color';
    } else if (shiftTime >= 500 && shiftTime <= 1200) {
      return 'day-category-border-color-color';
    } else if (shiftTime >= 1300 && shiftTime <= 2100) {
      return 'eve-category-border-color-color';
    } else {
      return '';
    }
  }

  getCorrectReqWorkforceCount(day) {
    const formattedDate = moment(day).format('YYYY-MM-DD');
    return this.allEmployeeListNewService.filter(
      (item) => item.date === formattedDate && !item.rdoDayOff
    );
  }
  getCorrectGenWorkforceCount(day) {
    return this.dailyWorkForce.reduce((acc, item) => acc + item.countOfEmp, 0);
  }

  detectDevice() {
    if (
      /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return 'drag-panel ';
    } else if (/iPad/i.test(navigator.userAgent)) {
      return 'drag-panel ';
    } else {
      return 'grid-container grid-container--fit ';
    }
  }

  getGLcolor(req, updated) {
    if (req > updated) {
      return ' font-bold-size';
    } else if (req < updated) {
      return 'font-bold-size';
    } else {
      return 'afont-bold-size';
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
  getStartHour(timeString) {
    return timeString.toString().padStart(4, '0');
  }
  getTooltime(l, f) {
    return l + ', ' + f;
  }
  stickyNotes = false
  clientX
  clientY
  stickyDetails
  noteEmpIdAndDate
  stickyNote(item , event){
    const screenWidth = window.innerWidth;
    this.noteEmpIdAndDate ={
      date : this.startDate,
      empId : item.empid
    }
    this.stickyDetails =item
    this.stickyNotes = true
    if (screenWidth > 768) {
      const { clientX, clientY } = event;
      this.clientX = clientX - 50
      this.clientY = clientY - 14
    }
  }

  closeSticky(value: boolean) {
    this.stickyNotes = value
  }

  async checkRule(data, time,arr) {
    let temp = [];
    const databyempid = this.allEmplListWeekly.filter((item) => item.empid == data.empid);
    databyempid.forEach(item => {
      if (item.rdoDayOff == 'X') {
        item.time = 'X'
        temp.push(item.time)
      } else {
        if (item.date == data.date) {
          item.time = time;
        }
        temp.push(item.time.toString().padStart(4, '0'))
        
      }
    })
    const shift_line = {
      "shift_line": temp,
      "shift_length": 8,
      "date":data.date,
      "bidscheduleid":data.bidscheduleid,
      "empid":data.empid,
      "time":time,
    }
    let tempArr = [];
    try {
      
      const res: any = await this.manageSchedule.checkPayperiodAndBusinessRule(shift_line).toPromise();
      
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == data.id) {
          element.rule = res
        }
        tempArr.push(element);
        
      }
      this.allEmployeeListNewService = tempArr
    } catch (error) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id == data.id) {
          element.rule = ["Something is wrong"]
        }
        tempArr.push(element);
        
      }
      this.allEmployeeListNewService = tempArr
    }
    // return res?.business_rules
  }
}
