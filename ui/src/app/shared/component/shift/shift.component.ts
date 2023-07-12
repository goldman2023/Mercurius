import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {

  @Input() shiftClass: string;
  @Input() shiftLabel: string;
  @Input() seq: number;
  @Input() shiftdurationc: string;
  constructor() { }

  ngOnInit(): void {
  }

}
