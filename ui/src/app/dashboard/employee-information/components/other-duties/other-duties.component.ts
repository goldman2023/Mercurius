import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  date: string;
  description: string;
  date_assigned: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { date: '01/02/2022', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
];
@Component({
  selector: 'app-other-duties',
  templateUrl: './other-duties.component.html',
  styleUrls: ['./other-duties.component.scss']
})
export class OtherDutiesComponent implements OnInit {
  displayedColumns: string[] = ['date', 'description', 'date_assigned'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
