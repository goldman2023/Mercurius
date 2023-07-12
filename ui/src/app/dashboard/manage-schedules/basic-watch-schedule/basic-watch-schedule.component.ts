import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ManageScheduleService } from 'src/app/services/manage-schedule.service';
import moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-basic-watch-schedule',
  templateUrl: './basic-watch-schedule.component.html',
  styleUrls: ['./basic-watch-schedule.component.scss'],
})
export class BasicWatchScheduleComponent implements OnInit {
  bid_schedule_list: any = [];
  dailyWorkForce: any = [];
  schedule_type = 'Daily';
  user_data;
  spinner = true;
  allTimeZone: any = [];
  selectBidScheduleNameForm;
  bidShculeTimeZoneacronym;
  bidShculeTimeZone;
  current_bid_schedule_data;
  current_bid_schedule_shiftline_shchedule_dates: any = [];
  firstName;
  lastName;
  allEmplListWeekly: any = [];
  weeklybasicWatchVacation: any = [];
  monthlybasicWatchVacation: any = [];
  selectOptions :string[] = ['Daily','Weekly','Monthly']
  bidSchedule;
  weekDates: any = [];
  startDate;
  endDate;
  datepicker = moment(new Date()).format('mm/dd/yyyy');
  dateShow = new Date();
  vacationWatchSchedule: any = [];
  selectedDate : any ;
  bidScheduleID 
  constructor(
    private fb: FormBuilder,
    public manageSchedule: ManageScheduleService
  ) {}


  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData') || '{}');

    this.selectBidScheduleNameForm = this.fb.group({
      bid_schedule_name: new FormControl('-- Select Bid Schedule --'),
      select_option: new FormControl('-- Select a Option --'),
      schedule_start_date: new FormControl(),
    });
    this.selectBidScheduleNameForm.patchValue({
      schedule_start_date: new Date(),
      select_option: this.schedule_type
    });
    this.getAllBidSchedule();
  }
getVacation(id,date){
  let formatDate = moment(date).format('YYYY-MM-DD')
  this.manageSchedule.basicWatchVacation(id,formatDate).subscribe(res => {
    this.vacationWatchSchedule = res
  })
}
  get bid_schedule_name() {
    return this.selectBidScheduleNameForm.get('bid_schedule_name');
  }

  get schedule_start_date() {
    return this.selectBidScheduleNameForm.get('schedule_start_date');
  }

  radioChange(event) {
    this.schedule_type = event.value.toString();
    event.value = new Date()
    
    this.dateChangeforBidSchedule(event);
    
  }

  getAllBidSchedule() {
    this.manageSchedule.bidScheduleList(this.user_data.id, 'posted').subscribe(
      (res) => {
        this.bid_schedule_list = res
        this.selectBidScheduleNameForm.patchValue({
          bid_schedule_name: res[0],
        });
        let date = moment(
          this.selectBidScheduleNameForm.controls.schedule_start_date.value
        ).format('YYYY-MM-DD');

    this.selectedDate = moment(this.selectBidScheduleNameForm.controls.schedule_start_date.value).format('YYYY-MM-DD');
        this.bidScheduleService(
          date,
          this.selectBidScheduleNameForm.controls.bid_schedule_name.value
        );
        this.current_bid_schedule_data = this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid
        this.getVacation(this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,this.selectBidScheduleNameForm.controls.schedule_start_date.value)
      },
      (err) => {
        console.log(err);
      },
      () => {}
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
  allEmployeeListNewService : any = []
  getEmployeesList(bid_schedule_name, date) {
    if (this.schedule_type === "Daily") {
      this.allEmplListWeekly = [];
      this.allEmployeeListNewService = [];
      let currentDate = moment(date).format('YYYY-MM-DD');

      this.manageSchedule.getWorkForceBasedOnShiftLineScheduleDateRangeAndId(
        moment(date).startOf('week').format('YYYY-MM-DD'), moment(date).endOf('week').format('YYYY-MM-DD'), bid_schedule_name.bidschid
      ).subscribe(res => {
        this.allEmplListWeekly = res
      },
        (error) => {
          console.log(error.massage);
        });
      this.manageSchedule
        .basicWatchSchedule(bid_schedule_name.bidschid, currentDate)
        .subscribe(
          (res) => {
            this.allEmployeeListNewService = res;
            this.bidScheduleID = this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid
          },
          (error) => {
            console.log(error.massage);
          },
          () => {
            this.spinner = false;
            this.startDate = currentDate;
            this.weekDates = currentDate;
          }
        );
    } else if (this.schedule_type === 'Weekly') {
      this.allEmplListWeekly = [];
      var curr = new Date(date);
      var day = curr.getDay();
      var firstday = new Date(curr.getTime() - 60*60*24* day*1000); //will return firstday (ie sunday) of the week
      var lastday = new Date(firstday.getTime() + 60 * 60 *24 * 6 * 1000); //adding (60*60*6*24*1000) means adding six days to the firstday which results in lastday (saturday) of the week
      let currentDate = moment(date).format('YYYY-MM-DD');
      this.manageSchedule.getWorkForceBasedOnShiftLineScheduleDateRangeAndId(
        moment(firstday).format('YYYY-MM-DD'), moment(lastday).format('YYYY-MM-DD'), bid_schedule_name.bidschid
      ).subscribe(res => {
        this.allEmplListWeekly = res
      },
      (error) => {
        console.log(error.massage);
      },

          () => {
            this.spinner = false;
            this.startDate = moment(firstday).format('YYYY-MM-DD');
            this.endDate = moment(lastday).format('YYYY-MM-DD');
            this.weekDates = currentDate;
          }
        );
      this.manageSchedule.getWeeklyBasicWatchVacation(
        moment(firstday).format('YYYY-MM-DD'), moment(lastday).format('YYYY-MM-DD'), bid_schedule_name.bidschid
      ).subscribe(res => {
        this.weeklybasicWatchVacation = res
      },
      (error) => {
        console.log(error.massage);
      },

          () => {
            this.spinner = false;
            this.weekDates = currentDate;
          }
        );
    }else if (this.schedule_type === 'Monthly') {
      this.allEmplListWeekly = [];
      var curr = new Date(date);
      var day = curr.getDay();
       let currentDate = moment(date).format('YYYY-MM-DD');
      this.manageSchedule.getWorkForceBasedOnShiftLineScheduleDateRangeAndId(
        moment(this.selectBidScheduleNameForm.value.schedule_start_date).startOf('month').format('YYYY-MM-DD') , moment(this.selectBidScheduleNameForm.value.schedule_start_date).endOf('month').format('YYYY-MM-DD'), bid_schedule_name.bidschid
      ).subscribe(res => {
        this.allEmplListWeekly = res
      },
      (error) => {
        console.log(error.massage);
      },

          () => {
            this.spinner = false;
            this.weekDates = currentDate;
          }
        );
      this.manageSchedule.getWeeklyBasicWatchVacation(
        moment(this.selectBidScheduleNameForm.value.schedule_start_date).startOf('month').format('YYYY-MM-DD'),  moment(this.selectBidScheduleNameForm.value.schedule_start_date).endOf('month').format('YYYY-MM-DD'), bid_schedule_name.bidschid
      ).subscribe(res => {
        this.monthlybasicWatchVacation = res
      },
      (error) => {
        console.log(error.massage);
      },

          () => {
            this.spinner = false;
            this.startDate = moment(firstday).format('YYYY-MM-DD');
            this.endDate = moment(lastday).format('YYYY-MM-DD');
            this.weekDates = currentDate;
          }
        );
    }
  }

  onChangeBidSchedule() {
    this.spinner = true;
    this.bidScheduleService(
      this.selectBidScheduleNameForm.controls.schedule_start_date,
      this.selectBidScheduleNameForm.value.bid_schedule_name
    );
    this.current_bid_schedule_data = this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid
    if (this.schedule_type === "Daily"){
      this.getVacation(this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,this.selectBidScheduleNameForm.controls.schedule_start_date)
    }
  }

  dateChangeforBidSchedule(ev) {
    this.spinner = true;
    this.dateShow = ev.value;
    var date = ev.value;
    this.selectBidScheduleNameForm.value.schedule_start_date = date;
    this.selectedDate = moment(date).format('YYYY-MM-DD')
    this.bidScheduleService(
      date,
      this.selectBidScheduleNameForm.controls.bid_schedule_name.value
    );
    this.current_bid_schedule_data = this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid
    if (this.schedule_type === "Daily"){
      this.getVacation(this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschid,this.selectedDate)
    }
  }
  getPermissionFunctionName(functionName){
    return this.user_data.permissionDetails.some(element => element.functionName === functionName);
  }
  generatePDF() {
    if(this.schedule_type == 'Daily'){
      this.dailyExport()
    }else if(this.schedule_type == 'Weekly'){
      this.weeklyExport()
    }
    else if(this.schedule_type == 'Monthly'){
      this.monthlyExport()
    }
  }

  getEndTime(startTime: string, duration: number): string {
    let data = (+startTime) + (duration * 100);
    if (data >= 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }
  weeklyExport() {
    const vacations = this.weeklybasicWatchVacation.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })
    const allVacationEmpList = []
    vacations.forEach(vacation => {
      vacation.empinfo.map(data => {
       const empdetaisl = {
          ...data,
          date: vacation.dailyDate
        }
        allVacationEmpList.push(empdetaisl)
      })
    })

    const dateGroupedArrayVacations = vacations.map((date) => {
      return allVacationEmpList.filter(
        (obj) => obj.date === date.dailyDate
      );
    });
    const tableHeaderVacation: any[] = [];
    vacations.forEach((date) => {
      tableHeaderVacation.push({ text: moment(date.dailyDate).format('M/D ddd'), style: 'tableHeader' });
    });
  
    const tableBodyVacation = [];
    const maxEmployeeCountVacation = Math.max(
      ...dateGroupedArrayVacations.map((dateGroup) => dateGroup.length)
    );
  
    for (let i = 0; i < maxEmployeeCountVacation; i++) {
      const row: any = [];
  
      vacations.forEach((date) => {
        const employee = dateGroupedArrayVacations.find(
          (dateGroup) => dateGroup[i]?.date === date.dailyDate
        );
        const name =
          employee && employee[i]
            ? `${employee[i].empLastName}, ${employee[i].empFirstName} ${moment(employee[i].vacationStartDate).format('MM/DD/YYYY')} - ${moment(employee[i].vacationEndDate).format('MM/DD/YYYY')}`
            : '';
        row.push({
          text: name,
          style: 'tableCell',
          minWidth: 50,
          maxWidth: 100,
        });
      });
  
      tableBodyVacation.push(row);
    }


    const uniqueDates = [...new Set(
        this.allEmplListWeekly
          .filter((obj) => !obj.rdoDayOff)
          .map((obj) => obj.date)
      ),
    ].sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
  
    const dateGroupedArray = uniqueDates.map((date) => {
      return this.allEmplListWeekly.filter(
        (obj) => obj.date === date && !obj.rdoDayOff
      );
    });
  
    const tableHeaderRow: any[] = [];
    uniqueDates.forEach((date) => {
      tableHeaderRow.push({ text: moment(date).format('M/D ddd'), style: 'tableHeader' });
    });
  
    const tableBody = [];
    const maxEmployeeCount = Math.max(
      ...dateGroupedArray.map((dateGroup) => dateGroup.length)
    );
  
    for (let i = 0; i < maxEmployeeCount; i++) {
      const row: any = [];
  
      uniqueDates.forEach((date) => {
        const employee = dateGroupedArray.find(
          (dateGroup) => dateGroup[i]?.date === date
        );
        const name =
          employee && employee[i]
            ? `${employee[i].empLastName}, ${employee[i].empFirstName} ${employee[i].time.toString().padStart(4, '0')} - ${this.getEndTime(employee[i].time.toString().padStart(4, '0'), employee[i].duration)}`
            : '';
        row.push({
          text: name,
          style: 'tableCell',
          minWidth: 50,
          maxWidth: 100,
        });
      });
  
      tableBody.push(row);
    }
     const dateGroupedArrayRdo = uniqueDates.map((date) => {
      return this.allEmplListWeekly.filter(
        (obj) => obj.date === date && obj.rdoDayOff
      );
    });
  
    const tableHeaderRowRdo: any[] = [];
    uniqueDates.forEach((date) => {
      tableHeaderRowRdo.push({ text: moment(date).format('M/D ddd'), style: 'tableHeader' });
    });
  
    const tableBodyRdo = [];
    const maxEmployeeCountRdo = Math.max(
      ...dateGroupedArrayRdo.map((dateGroup) => dateGroup.length)
    );
  
    for (let i = 0; i < maxEmployeeCountRdo; i++) {
      const row: any = [];
  
      uniqueDates.forEach((date) => {
        const employee = dateGroupedArrayRdo.find(
          (dateGroup) => dateGroup[i]?.date === date
        );
        const name =
          employee && employee[i]
            ? `${employee[i].empLastName}, ${employee[i].empFirstName} ${employee[i].time.toString().padStart(4, '0')} - ${this.getEndTime(employee[i].time.toString().padStart(4, '0'), employee[i].duration)}`
            : '';
        row.push({
          text: name,
          style: 'tableCell',
          minWidth: 50,
        });
      });
  
      tableBodyRdo.push(row);
    }
  
    const docDefinition = {
      pageSize: 'A4',
      margin: [5,5,5,5],
      content: [
        [
          { text: 'Weekly Shift Summary', style: 'header' },
          '\n\n',
          {
            style: 'table',
            table: {
              headerRows: 1,
              body: [tableHeaderRow, ...tableBody],
            },
          },
        ],
        [
          { text: 'Weekly RDO Summary', style: 'header' },
          '\n\n',
          {
            style: 'table',
            table: {
              headerRows: 1,
              body: [tableHeaderRowRdo, ...tableBodyRdo],
            },
          },
        ],
        [
          { text: 'Weekly Vacation Summary', style: 'header' },
          '\n\n',
          {
            style: 'table',
            table: {
              headerRows: 1,
              body: [tableHeaderVacation, ...tableBodyVacation],
            },
          },
        ],
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          margin: [0, 5, 0, 0],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        table: {
          margin: [0, 0, 0, 40],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
        },
        tableCell: {
          fontSize: 10,
          color: 'black',
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('weeklySummary.pdf');
  }
  allUniqueDates: any = []
  monthlyExport() {
    const currentDate = moment();
    const startDate = currentDate.clone().startOf('month').startOf('week');
    const endDate = currentDate.clone().endOf('month').endOf('week');

    const tableHeaderRow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tableBody = [];
    let currentDay = startDate.clone();
    const emplyeeList = this.allEmplListWeekly
    
    emplyeeList.sort((a, b) => {
      if (!a.rdoDayOff && b.rdoDayOff && !a.vacationHours && !b.vacationHours || !a.vacationHours && b.vacationHours) {
        return -1; 
      }
      if (a.rdoDayOff && !b.rdoDayOff && !a.vacationHours && !b.vacationHours || a.vacationHours && !b.vacationHours) {
        return 1; 
      }
      return a.date.localeCompare(b.date); 
    });
    
    
    
    
    while (currentDay.isSameOrBefore(endDate, 'day')) {
      const row = [];
      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = currentDay.isSame(currentDate, 'month');
        const dayOfMonth = isCurrentMonth ? currentDay.format('DD') : '';
        const textStyle = isCurrentMonth ? 'tableCell' : 'tableCellOtherMonth';
        const employeesForDate = this.allEmplListWeekly.filter((empl) =>
          moment(empl.date).isSame(currentDay, 'day')
        );

        const cellContent = [];
        if (employeesForDate.length > 0) {
          cellContent.push(dayOfMonth);
          const employeeTable = {
            style: 'employeeTable',
            maxWidth: '*',
            table: {
              body: employeesForDate.map((employee) => {
                if(!employee.rdoDayOff && !employee.vacationHours){
                  return [
                
                    { text: `${employee.empFirstName} ${employee.empLastName} 
                    (${employee.empinitials}) 
                    (${employee.time?.toString().padStart(4, '0')}-${this.getEndTime(employee.time?.toString().padStart(4, '0'), employee.duration)})`, 
                    style: 'employeeCell' }
                  ]
                }
                else if(employee.rdoDayOff && !employee.vacationHours){
                  return [
                
                    { text: `${employee.empFirstName} ${employee.empLastName} (${employee.empinitials}) (RDO)`, 
                    style: 'employeeCell' }
                  ]
                } 
                else if(employee.vacationHours){
                  return [
                
                    { text: `${employee.empFirstName} ${employee.empLastName} (${employee.empinitials}) (Vacation)`, 
                    style: 'employeeCell' }
                  ]
                } 
              })
            },
            layout: {
              hLineWidth: () => 0.5, 
              vLineWidth: () => 0, 
              hLineColor: () => '#4e4d4c', 
              vLineColor: () => '#4e4d4c'
            },
            margin: [0, 0, 0, 0],
          };
          cellContent.push(employeeTable);
        } else {
          cellContent.push({ text: dayOfMonth, style: textStyle,margin: [0, 0, 0, 0],alignment: 'center'});
        }

        row.push({
          stack: cellContent,
          alignment: 'center',
        });

        currentDay.add(1, 'day');
      }
      tableBody.push(row);
    }

    const docDefinition = {
      pageSize: 'A4',
      margin: [0, 0, 0, 0],
      content: [
        { text: 'Monthly Shift Summary', style: 'header' },
        '\n\n',
        {
          style: 'table',
          table: {
            headerRows: 1,
            body: [tableHeaderRow, ...tableBody],
            alignment: 'center',
            widths: Array(7).fill('14.285714286%') ,
            padding:'0'
          },
          layout: {
            hLineWidth: () => 1, 
            vLineWidth: () => 1, 
            hLineColor: () => '#4e4d4c', 
            vLineColor: () => '#4e4d4c',
            paddingLeft: () => 0, 
            paddingRight: () => 0, 
          }
        }
      ],
      styles: {
        header: {
          fontSize: 11,
          bold: false,
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        tableCell: {
          fontSize: 10,
          color: 'black',
          alignment: 'center',
          margin: [0, 0, 0, 0],
          padding: '0',
          fillColor: '#ffe4c4' 
        },
        tableCellOtherMonth: {
          fontSize: 10,
          color: 'gray',
          alignment: 'center',
          fillColor: '#ffffff' 
        },
        employeeTable: {
          margin: [0, 0, 0, 0],
          fontSize: 8,
          alignment: 'left',
          fillColor: '#ffffff',
          
        },
          employeeCell: {
            margin: [0, 0, 0, 0]
          }
        }
      };
    
    // Create PDF and download
    pdfMake.createPdf(docDefinition).download('MonthlySummary.pdf');
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
  getUniqueDates(allEmplListWeekly) { 
  
    let uniqueDates = new Set();
  
    allEmplListWeekly.forEach((item) => {
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
  
    return (this.allUniqueDates = datesInRange);
  }
  
  

  
  dailyExport(){
    let shift = [];
    let dayOff = [];
    let vacation = [];
    this.allEmployeeListNewService.forEach(element => {
      if(!element.rdoDayOff){
        let data = [
          element.time.toString().padStart(4, '0'),
          `${element.empLastName}, ${element.empFirstName} (${element.empinitials})`
        ]
        shift.push(data)
      } else {
        let data = [
          element.time.toString().padStart(4, '0'),
          `${element.empLastName}, ${element.empFirstName} (${element.empinitials})`
        ]
        dayOff.push(data)
      }
    });
    this.vacationWatchSchedule.empinfo.forEach(element => {
      let data = [
        `${element.empLastName}, ${element.empFirstName} (${element.empInitials})`,
        moment(element.vacationStartDate).format('MM-DD-YYYY'),
        moment(element.vacationEndDate).format('MM-DD-YYYY'),
        element.vacationHours,
      ]
      vacation.push(data)
    });

    const docDefinition = {
      content: [
        {
          text: 'Daily Basic Watch Schedule',
          style: 'header'
        },
        {
          text: '',
          style: 'header'
        },
        {
          text: `Date: ${moment(this.selectBidScheduleNameForm.controls.schedule_start_date).format('DD-MMMM-YYYY')}`,
          style: 'header'
        },
        {
          text: `Bid Schedule Name : ${this.selectBidScheduleNameForm.controls.bid_schedule_name.value.bidschename}`,
          style: 'header'
        },
        {
          text: `Area Name : ${this.user_data.areaname}`,
          style: 'header'
        },
        {
          columns: [
            {
              width: '35%',
              stack: [
                {
                  text: 'Shift Schedule',
                  style: 'subheader',
                  margin: [0, 10, 0, 5] // bottom margin
                },
                {
                  table: {
                    headerRows: 1,
                    width: 'auto',
                    body: [
                      [
                        {text: 'Shifts', style: 'tableHeader'},
                        {text: 'Name', style: 'tableHeader'}
                      ],
                      ...shift // using spread operator to add data to the table
                    ]
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return (rowIndex === 0) ? '#CCCCCC' : null;
                    }
                  }
                }
              ]
            },
            {
              width: '65%',
              stack: [
                {
                  text: 'Regular Day Off',
                  style: 'subheader',
                  margin: [0, 10, 0, 5] // bottom margin
                },
                {
                  table: {
                    headerRows: 2,
                    body: [
                      [
                        {text: 'Employee Name', style: 'tableHeader'}
                      ],
                      ...dayOff.map(data => [data[1]]) // using spread operator to add data to the table
                    ]
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return (rowIndex === 0) ? '#CCCCCC' : null;
                    }
                  }
                },
                {
                  text: 'Vacation Summary',
                  style: 'subheader',
                  margin: [0, 10, 0, 5] // bottom margin
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', '18%'],
                    body: [
                      [
                        {text: 'Employee Name', style: 'tableHeader'},
                        {text: 'Start Date', style: 'tableHeader'},
                        {text: 'End Date', style: 'tableHeader'},
                        {text: 'Vacation Hours', style: 'tableHeader'}
                      ],
                      ...vacation // using spread operator to add data to the table
                    ]
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return (rowIndex === 0) ? '#CCCCCC' : null;
                    }
                  }
                }
              ]
            }
          ],
          columnGap: 20 // gap between the two columns
        
        }
      ]
    }


   pdfMake.createPdf(docDefinition).download('dailybasicwatchschedule.pdf');
  }
 
}
