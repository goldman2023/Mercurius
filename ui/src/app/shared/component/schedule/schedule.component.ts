import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubmitRequestModalComponent } from 'src/app/dashboard/manage-schedules/component/submit-request-modal/submit-request-modal.component';

import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StickyNoteComponent } from '../sticky-note/sticky-note.component';
import { AlertController } from '@ionic/angular';
import { PayPeriodService } from 'src/app/services/pay-period/pay-period.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [DatePipe]
})
export class ScheduleComponent implements OnInit {
  @Input() empId;
  @Input() bidScheduleID;
  @Input() wroksheetData: any = null;
  @Input() fullEmpDetails: any;
  schedule = true
  dateShowform: FormControl = new FormControl();
  public currentDate: Date = new Date();
  currentDateof;
  firstName;
  lastName;
  initial;
  isdataAvailable = false;

  overlayRef: OverlayRef | null;
  empid: number;
  managerid: number;
  initials: string;
  isHandset: boolean;
  duration: number;

  constructor(public dialog: MatDialog,
    public alertController: AlertController,
    public payPeriodService: PayPeriodService,
    public dataService: CommonService
    ) {}
  dataSource: any = [];
  public allowMultipleOwner: Boolean = true;
  
  dateForm = new FormGroup({
    dateShow: new FormControl('', Validators.required),
  })
  allNotes = []
  noteUpdate = false;
  message
  ngOnInit(): void {
    this.currentDateof = moment(new Date()).format('YYYY-MM-DD');
    this.dateShow = this.currentDate;
    this.dateForm.patchValue({
        dateShow: this.currentDate
    })
    this.dataService.getData().subscribe(async data => {
        this.message = data
        this.callSchedule()
      });
      this.callSchedule()
    }
    callSchedule(){
      this.dataSource = [];
      this.allNotes = []
    this.wroksheetData.vacationInfo.forEach((element, index) => {
      const startDate = moment(element.vacationStartDate, 'YYYY-MM-DD');
      const endDate = moment(element.vacationEndDate, 'YYYY-MM-DD');
      const dates = [];
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        let data = {
          Id: index + 1,
          Subject: 'VL',
          StartTime: moment(currentDate).format(
            'YYYY-MM-DD'
          ),
          EndTime: this.formatDate(element.vacationEndDate, '0'),
          CssClass: 'vacation',
          CssClass2: 'vacation-b',
          Color: '#fff',
          CategoryColor: '#f46704',
          note: false,
          DepartmentName: 'GENERAL',
        };
        this.dataSource.push(data);
        currentDate.add(1, 'day');
      }
    });

    this.wroksheetData.shiftInfo.forEach((element, index) => {
      let data = {
        Id: index + 1,
        Subject: element.rdoDayOff
          ? 'RDO'
          : moment(this.formatDate(element.date, element.time)).format(
              'hh:mm a'
            ) +
            ' - ' +
            (moment(this.formatDate(element.date, element.time)).format(
              'YYYY-MM-DD'
            ) !==
            moment(
              this.formatDate(
                element.date,
                this.getEndTime(element.time, element.duration)
              )
            ).format('YYYY-MM-DD')
              ? moment(this.formatDate(element.date, element.time)).format(
                  'hh:mm a'
                )
              : moment(
                  this.formatDate(
                    element.date,
                    this.getEndTime(element.time, element.duration)
                  )
                ).format('hh:mm a')),
        StartTime: moment(element.date).format(
          'YYYY-MM-DD'
        ),
        EndTime:
          moment(this.formatDate(element.date, element.time)).format(
            'YYYY-MM-DD'
          ) !==
          moment(
            this.formatDate(
              element.date,
              this.getEndTime(element.time, element.duration)
            )
          ).format('YYYY-MM-DD')
            ? this.formatDate(element.date, element.time)
            : this.formatDate(
                element.date,
                this.getEndTime(element.time, element.duration)
              ),
        CssClass: element.rdoDayOff ? 'rdo-event' : 'time-event',
        CssClass2: element.rdoDayOff ? 'rdo-event-b' : 'time-event-b',
        CategoryColor: element.rdoDayOff ? 'rgb(201 199 196)' : '#FFF',
        Color: '#000',
        DepartmentName: 'GENERAL',
      };
      this.dataSource.push(data);
    });
    this.payPeriodService.getAllEmployeeNotes(this.fullEmpDetails.empid, this.fullEmpDetails.managerid).subscribe(res => {
      this.allNotes = res
      this.allNotes.forEach(( note, index )=> {
        let data = {
          Id: note.id,
          Subject: note.title,
          StartTime: moment(note.submittedForDate).format(
            'YYYY-MM-DD'
          ),
          EndTime: this.formatDate(note.submittedForDate, '0'),
          CssClass: 'note',
          CssClass2: 'note-b',
          Color: '#fff',
          submitteddatetime: note.submitteddate,
          submittedby: note.submittedby,
          submittedForDate: note.submittedForDate,
          noteDetails: note.description,
        };
        this.dataSource.push(data);
      })
      this.getFullMonthDates(this.currentDate);
    })
  }
  today(){
    this.dateShow = this.currentDate
    this.dateForm.patchValue({
        dateShow: this.currentDate
    })
    this.getFullMonthDates(this.dateForm.value.dateShow)
  }
  dateShow;
  dateChangeforBidSchedule(e) {
    this.dateShow = e.value;
    this.getFullMonthDates(this.dateShow);
  }
  getNextMonthFirstDate(date) {
    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    const firstDateNextMonth = new Date(nextYear, nextMonth, 2);
    this.dateShow = new Date(firstDateNextMonth.toISOString().slice(0, 10));
    this.dateForm.patchValue({
        dateShow: this.dateShow
    })
    this.getFullMonthDates(this.dateShow);
  }
  getPreviousMonthFirstDate(date) {
    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear--;
    }
    const firstDatePreviousMonth = new Date(previousYear, previousMonth, 2);

    this.dateShow = new Date(firstDatePreviousMonth.toISOString().slice(0, 10));
    this.dateForm.patchValue({
        dateShow: this.dateShow
    })
    this.getFullMonthDates(this.dateShow);
  }
  fullMonthDates;
  getFullMonthDates(selectedDate) {
    this.fullMonthDates = []
    const currentDate = new Date(selectedDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);

    const dates = [];
    const startDate = new Date(firstDate); 

    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (
      let date = startDate;
      date <= lastDate;
      date.setDate(date.getDate() + 1)
    ) {
      const filteredData = this.dataSource.filter((data) => data.StartTime === moment(new Date(date)).format('YYYY-MM-DD'));
        let alldata
      if(filteredData.some(item => item.CssClass === 'note')){
         alldata = {
        date: new Date(date),
        dataArray: filteredData,
        note: true
        };
      }else{
        alldata = {
          date: new Date(date),
          dataArray: filteredData,
          note: false
          };
      }
        dates.push(alldata);
    }

    const nextMonthDate = new Date(lastDate);
    nextMonthDate.setDate(nextMonthDate.getDate() + 1);

    while (dates.length % 7 !== 0) {
        const filteredData = this.dataSource.filter((data) => data.StartTime === moment(new Date(nextMonthDate)).format('YYYY-MM-DD'));
       let alldata
        if(filteredData.some(item => item.CssClass === 'note')){
          alldata = {
            date: new Date(nextMonthDate),
            dataArray: filteredData,
            note: true
            };
        }else{
          alldata = {
            date: new Date(nextMonthDate),
            dataArray: filteredData,
            note: false
            };
        }
        dates.push(alldata);
        nextMonthDate.setDate(nextMonthDate.getDate() + 1);
    }
    this.fullMonthDates = dates;
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

  allUniqueDates;
  getUniqueDates(allEmplListWeekly) {
    let uniqueDates = new Set();

    allEmplListWeekly.forEach((item) => {
      const date = item.date; 
      if (date) {
        uniqueDates.add(date);
      }
    });

    const sortedDates = Array.from(uniqueDates).sort();

    const firstDate = moment(sortedDates[0]);
    const lastDate = moment(sortedDates[sortedDates.length - 1]);

    const startDate = firstDate.startOf('week'); 
    const endDate = lastDate.endOf('week');

    const datesInRange = [];
    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      datesInRange.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, 'day');
    }
    return datesInRange;
  }

  formatDate(dateStr, timeStr) {
    const date = new Date(dateStr);
    const timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timezoneOffset);
  
    const hours = Math.floor(+timeStr / 100);
    const minutes = +timeStr % 100;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
  
    return `${formattedDate} ${formattedTime}`;
  }
  getEndTime(startTime: string, duration: number): string {
    let data = +startTime + duration * 100;
    if (data >= 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }

  takenDate: string;

  submitRequest(item, date) {
    let data = {
      empid: this.fullEmpDetails.empid,
      bidScheduleId: this.bidScheduleID,
      managerid: this.fullEmpDetails.managerid,
      empinitials: this.fullEmpDetails.initials,
      takenDate: date,
      duration: this.fullEmpDetails.duration
    };
    const dialogRef = this.dialog.open(SubmitRequestModalComponent, {
      width: '822px',
      height: '723px',
      data: {
        ...data,
        bidScheduleId: this.fullEmpDetails.bidscheduleid
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  checkMonth(date1, date2) {
    const month1 = moment(date1).format('YYYY-MM');
    const month2 = moment(date2).format('YYYY-MM');

    return month1 === month2;
  }
  events = []
  viewDate 
  showDateEve(eventes, date){
    this.viewDate = date
    this.events = eventes
  }
  stickyNotes = false
  clientX
  clientY
  stickyDetails
  stickyDate
  stickyNoteData = []
  noteEmpIdAndDate
  stickyNote(item , event, date){
    this.noteEmpIdAndDate ={
      date : date.date,
      empId : this.fullEmpDetails.empid
    }
    this.stickyDetails = this.fullEmpDetails
    this.stickyNotes = true
    const screenWidth = window.innerWidth;
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
