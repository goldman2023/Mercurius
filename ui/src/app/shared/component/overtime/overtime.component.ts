import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  date: string;
  description: string;
  type: string;
  date_assigned: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { date: '01/02/2022',type: 'CH', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Spot Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: 'Vacation Leave', date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
  { date: '01/02/2022',type: 'CH', description: "Non Vacation Leave", date_assigned: '01/02/2022'},
];
@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss']
})
export class OvertimeComponent implements OnInit {
  displayedColumns: string[] = ['date', 'type', 'description', 'date_assigned'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
