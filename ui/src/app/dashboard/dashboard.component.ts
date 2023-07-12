import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EventServiceService } from '../services/event-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  menuType: string = 'overlay';
  headerSecond:HTMLElement;

  constructor(public navCtrl: NavController,private eventService:EventServiceService,public viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.headerSecond = this.viewContainerRef.element.nativeElement.querySelector('.stlines-scrollable');
  }
  test() {
    this.navCtrl.navigateForward('dashboard/test');
  }

  onScroll(event: any) {
    const scrollTopValue = this.headerSecond.scrollTop;
    this.eventService.emitEvent(scrollTopValue);
  }
}
