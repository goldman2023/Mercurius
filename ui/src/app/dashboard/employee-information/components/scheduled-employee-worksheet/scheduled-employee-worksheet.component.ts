import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import moment, { duration } from 'moment';
import { HeaderTitleService } from 'src/app/dashboard/nav-bar-footer/header-title.service';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import { ServiceService } from '../../service.service';
import {HTMLOptions, jsPDF}from 'jspdf';  
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-scheduled-employee-worksheet',
  templateUrl: './scheduled-employee-worksheet.component.html',
  styleUrls: ['./scheduled-employee-worksheet.component.scss'],
})
export class ScheduledEmployeeWorksheetComponent implements OnInit {
  datepicker = moment(new Date()).format('mm/dd/yyyy');
  dateShow = new Date();

  selectBidScheduleNameForm;
  bid_schedule_list: any = [];
  dailyWorkForce: any = [];
  schedule_type = 'daily';
  user_data;
  spinner = true;
  allTimeZone: any = [];
  bidShculeTimeZoneacronym;
  bidShculeTimeZone;
  current_bid_schedule_data;
  current_bid_schedule_shiftline_shchedule_dates: any = [];
  firstName;
  lastName;
  allEmplListWeekly: any = [];

  bidSchedule;
  weekDates: any = [];
  startDate;
  endDate;
  allEmployeeListNewService: any = [];
  vacationWatchSchedule: any = [];
  shiftList;
  constructor(
    private fb: FormBuilder,
    public manageSchedule: ManageScheduleService,
    private router: Router,
    private headerTitleService: HeaderTitleService,
    public serviceService: ServiceService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {

    this.headerTitleService.setTitle(' ');
    this.headerTitleService.setBackUrl('sTlines-dashboard');
    this.headerTitleService.setForwardUrl('');
    this.headerTitleService.setDefaultHeader(true);
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');
    this.selectBidScheduleNameForm = this.fb.group({
      bid_schedule_name: new FormControl('-- Select Bid Schedule--'),
      schedule_start_date: new FormControl(),
    });
    this.selectBidScheduleNameForm.patchValue({
      schedule_start_date: new Date(),
    });

    this.getAllBidSchedule();
  }

  valueChanged(ev) {
    this.dateShow = ev.value;
  }

  get bid_schedule_name() {
    return this.selectBidScheduleNameForm.get('bid_schedule_name');
  }

  get schedule_start_date() {
    return this.selectBidScheduleNameForm.get('schedule_start_date');
  }

  getAllBidSchedule() {
    this.manageSchedule.bidScheduleList(this.user_data.id, 'posted').subscribe(
      (res) => {
        this.bid_schedule_list = res;
        this.selectBidScheduleNameForm.patchValue({
          bid_schedule_name: res[0],
        });
        let date = moment(
          this.selectBidScheduleNameForm.controls.schedule_start_date.value
        ).format('YYYY-MM-DD');
        this.bidScheduleService(
          date,
          this.selectBidScheduleNameForm.controls.bid_schedule_name.value
        );
        this.getVacation(
          this.selectBidScheduleNameForm.controls.bid_schedule_name.value
            .bidschid,
          this.selectBidScheduleNameForm.controls.schedule_start_date.value
        );
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }
  onChangeBidSchedule() {
    this.bidScheduleService(
      this.selectBidScheduleNameForm.controls.schedule_start_date,
      this.selectBidScheduleNameForm.value.bid_schedule_name
    );
    this.getVacation(
      this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,
      this.selectBidScheduleNameForm.controls.schedule_start_date.value
    );
  }

  bidScheduleService(day, data) {
    let dayName = moment(day).format('dddd').substring(0, 3);
    this.manageSchedule
      .getWorkForceBasedOnShiftLineScheduleDayAndId(
        dayName,
        data?.shiftdefmap[0].shiftdefref
      )
      .subscribe(
        (res2) => {
          this.dailyWorkForce = res2;
          this.getEmployeesList(
            this.selectBidScheduleNameForm.controls.bid_schedule_name.value,
            this.selectBidScheduleNameForm.controls.schedule_start_date.value
          );
        },
        (err) => {
          console.log(err);
        },
        () => {}
      );
  }
  getEmployeesList(bid_schedule_name, date) {
    this.allEmployeeListNewService = [];
    let currentDate = moment(date).format('YYYY-MM-DD');
    this.manageSchedule
      .basicWatchSchedule(bid_schedule_name.bidschid, currentDate)
      .subscribe(
        (res) => {
          this.allEmployeeListNewService = res;
          this.createUniqueTimeArrays(this.allEmployeeListNewService);
        },
        (error) => {
          console.log(error.massage);
        },
        () => {
          this.startDate = currentDate;
          this.weekDates = currentDate;
        }
      );
  }
  dateChangeforBidSchedule(ev) {
    this.spinner = true;
    this.dateShow = ev.value;

    var date = ev.value;
    this.selectBidScheduleNameForm.value.schedule_start_date = date;
    this.bidScheduleService(
      date,
      this.selectBidScheduleNameForm.controls.bid_schedule_name.value
    );
    this.getVacation(
      this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,
      this.selectBidScheduleNameForm.controls.schedule_start_date.value
    );
  }

  getRdoEmpL() {
    return this.allEmployeeListNewService.filter(
      (item) => item.rdoDayOff === 'X'
    );
  }

  getMidShift(allEmployeeListNewService) {
    const nightShiftEmployees = allEmployeeListNewService.filter((employee) => {
      // const time = employee.time;
      return !employee.rdoDayOff;
    });
    return nightShiftEmployees;
  }
  getBackgroundColorForShiftCategory(shiftTime) {
    if (shiftTime == 0) {
      return 'mid-category-bg-color app-padding-margin-0 mid-category-border-color-color';
    } else if (shiftTime == 1) {
      return 'day-category-bg-color app-padding-margin-0 day-category-border-color-color';
    } else if (shiftTime == 2) {
      return 'eve-category-bg-color app-padding-margin-0 eve-category-border-color-color';
    } else {
      return 'app-padding-margin-0';
    }
  }
  getBorderColorForShiftCategory(shiftTime) {
    if (shiftTime >= 2200 || shiftTime <= 400) {
      return 'mid-category-border-color-color';
    } else if (shiftTime >= 500 && shiftTime <= 1200) {
      return 'day-category-border-color-color';
    } else if (shiftTime >= 1300 && shiftTime <= 2100) {
      return 'eve-category-border-color-color';
    } else {
      return '';
    }
  }

  createUniqueTimeArraysByShiftTime(allEmployeeListNewService) {
    const uniqueTimes = [
      ...new Set(allEmployeeListNewService.map((employee) => employee.time)),
    ];
    const uniqueTimeArrays = [];

    uniqueTimes.forEach((time) => {
      const timeArray = allEmployeeListNewService.filter(
        (employee) => employee.time === time
      );
      uniqueTimeArrays.push(timeArray);
    });
    return uniqueTimeArrays;
  }

  createUniqueTimeArrays(allEmployeeListNewService) {
    const timeRange1Array = allEmployeeListNewService.filter((employee) => {
      const time = employee.time;
      return (2200 <= time || time <= 400) && !employee.rdoDayOff;
    });

    const timeRange2Array = allEmployeeListNewService.filter((employee) => {
      const time = employee.time;
      return time >= 500 && time <= 1200 && !employee.rdoDayOff;
    });

    const timeRange3Array = allEmployeeListNewService.filter((employee) => {
      const time = employee.time;
      return time >= 1300 && time <= 2100 && !employee.rdoDayOff;
    });

    const separatedArrays = [timeRange1Array, timeRange2Array, timeRange3Array];

    this.shiftList = separatedArrays;
  }
  geShiftName(index) {
    if (index == 0) {
      return 'MID SHIFT';
    }
    if (index == 1) {
      return 'DAY SHIFT';
    }
    if (index == 2) {
      return 'EVE SHIFT';
    }
  }
  convertTimeFormat(time) {
    const hours = Math.floor(time / 100); // extract the hours
    const minutes = time % 100; // extract the minutes
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  convertTimeFormatRange(time, duration) {
    let startTime = time + duration * 100;
    if (startTime >= 2400) {
      startTime -= 2400;
    }
    const hours = Math.floor(startTime / 100); // extract the hours
    const minutes = startTime % 100; // extract the minutes
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  epmLink(emp) {
    localStorage.setItem('bidScheduleId', this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid );
    this.router.navigate([
      'sTlines-dashboard/daily-worksheet',
      emp.empid,this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,
      'schedule',
    ]);
    this.serviceService.emFullDetails$.next(emp)
    // this.goDown2(emp.empid)
  }

  requier(requier) {
    let requierCount = 0;
    const uniqueTimes = requier.reduce((acc, obj) => {
      if (!acc.includes(obj.time)) {
        acc.push(obj.time);
      }
      return acc;
    }, []);

    this.dailyWorkForce.forEach((element) => {
      if (uniqueTimes.includes(element.shiftTime)) {
        requierCount += element.countOfEmp;
      }
    });
    return requierCount;
  }
  getTooltime(l, f) {
    return l + ', ' + f;
  }
  getVacation(id, date) {
    let formatDate = moment(date).format('YYYY-MM-DD');
    this.manageSchedule.basicWatchVacation(id, formatDate).subscribe((res) => {
      this.vacationWatchSchedule = res;
    });
  }
  // goDown2(id) {
  //   //this.scroller.scrollToAnchor("targetGreen");
  //   document.getElementById(id).scrollIntoView({
  //     behavior: "smooth",
  //     // block: "start",
  //     // inline: "nearest"
  //   });
  // }
  @ViewChild('content') content: ElementRef;
  @ViewChild('myDropdown') myDropdown: ElementRef;
  makePdf() { 
    let doc = new jsPDF('p', 'px', 'a0');
    doc.html(this.content.nativeElement).save("dailyworksheet.pdf")
  }
  selectedOption: string ;

  // makePdf(selectedOption: string) { 
  //   console.log(selectedOption);
  
  //   let dropdown = this.myDropdown ? this.myDropdown.nativeElement : null;
  
  //   if (dropdown) {
  //     this.renderer.setStyle(dropdown, 'color', 'red');
  //   }
  
  //   const callback = () => {
  //     let doc = new jsPDF('p', 'px', 'a0');
  
  //     if (dropdown) {
  //       let color = window.getComputedStyle(dropdown).getPropertyValue('color');
  //       doc.setTextColor(color);
  //       this.renderer.removeStyle(dropdown, 'color');
  //     }
  
  //     doc.html(this.content.nativeElement, {
  //       callback: () => {
  //         doc.save('dailyworksheet.pdf');
  //       }
  //     });
  //   }
  
  //   if (dropdown) {
  //     dropdown.addEventListener('load', callback);
  //   } else {
  //     callback();
  //   }
  // }
}
