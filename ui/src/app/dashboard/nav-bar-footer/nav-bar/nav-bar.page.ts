import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.page.html',
  styleUrls: ['./nav-bar.page.scss'],
})
export class NavBarPage implements OnInit {
  hide=true
  constructor() { }

  ngOnInit() {
  }
  forwardOldGeneratedShiftLines(){}
  goBack(){}
}
