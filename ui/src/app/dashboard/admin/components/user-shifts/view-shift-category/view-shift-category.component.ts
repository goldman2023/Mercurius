import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-shift-category',
  templateUrl: './view-shift-category.component.html',
  styleUrls: ['./view-shift-category.component.scss']
})
export class ViewShiftCategoryComponent implements OnInit {

  viewName;
  viewElement;
  displayedColumns: Array<string> = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
  ];
  length = 5;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  endTime;
  duration;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.viewName = data.viewName;
    this.viewElement = data.dataKey;
    this.duration = this.viewElement.s_duration * 100;
    this.endTime = parseInt(this.viewElement.s_time) + this.duration;
  }

  ngOnInit(): void {}
  @ViewChild(MatSort) sort!: MatSort;


  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  testSortChange() {
    alert('changed');
  }
  getStartHour(startTime) {
    const [hours, minutes] = startTime.split(':').slice(0, 2);
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return formattedHours + formattedMinutes;
  }
   getEndTime(s, d) {
    let data = (+s.split(':')[0] * 100) + +d * 100;
    if (data > 2400) {
      data -= 2400;
    }
    return data.toString().padStart(4, '0');
  }
  formatTime24to12(timeStr) {
    let [hours, minutes] = timeStr.split(":");
    let ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
}
