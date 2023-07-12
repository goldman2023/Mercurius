import { Component } from '@angular/core';
import { Router } from '@angular/router';
import workloadData from '../json/work-load-data.json';
import { ModalController, NavController } from '@ionic/angular';
import { WorkLoadService } from '../services/work-load.service';
import straightlines_io_apis from 'src/app/json/apis.json';
import { fadeInAnimation, slideInOutAnimation } from '../animations';
import { group } from '@angular/animations';
// import { DomSanitizer } from '@angular/platform-browser';
import { StraightlinesIoVideoPage } from './straightlines-io-video/straightlines-io-video.page';
@Component({
  selector: 'app-home',
  // animations: [slideInOutAnimation],


  // host: { '[@slideInOutAnimation]': 'home' },
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worData=workloadData
  allShift: any;
  errorMsg: any;
  work_load_data=workloadData
  allShiftData
  shiftLen
    allll=[]as any
    sh_startTime
    shift_name
    convertTimetoString
    allShiftName=[] as any
  test1: { sh_name: any; };
  arrangeShiftdefintionG=[];
  arrangeShiftdefintionL=[];
  safeURL
  videoUrl = 'assets/video/straightlines-io.mp4'
  user_data: any;
  constructor(public route:Router,public navCtrl: NavController,
    public shiftDefSer:WorkLoadService,
    public modalCtrl: ModalController,
     ) {

}
ngOnInit(allShift){
  this.safeURL = this.videoUrl;
  this.user_data=JSON.parse(sessionStorage.getItem('userData'))
  // this.initializeApp()
  // this.shiftDefSer.getAllShiftDefinition(this.user_data.id).subscribe(

  }
  // initializeApp() {
  //   // this.platform.ready().then(() => {
  //     // this.statusBar.styleDefault();
  //     this.navCtrl.navigateForward('welcome');
  //   // });
  // }

  async video(){
      const modal = await this.modalCtrl.create({
        component: StraightlinesIoVideoPage,
        cssClass: 'straightlinesIoVideo',
        swipeToClose:true
        // componentProps: { scheduleData: scheduleShift }

      });
      // this.scheduleShift=EditScheduleDataPage.data5

      return await modal.present();

    }


  // }

// getAllShiftData(allShift){

//   this.allll=[]
//   // (allShift)
//   this.allShiftData=  allShift
//
//   this.test1={"sh_name":null}
//   localStorage.setItem('newSHiftDefinition',JSON.stringify(this.test1))

//   if(this.allShiftData!=null){


//       for(var i=0;i<this.allShiftData.length;i++){
//         this.convertTimetoString=Array.from(this.allShiftData[i].sh_starttime)
//         this.sh_startTime=this.convertTimetoString[0]+this.convertTimetoString[1]+this.convertTimetoString[3]+this.convertTimetoString[4]
//           this.shift_name=this.allShiftData[i].sh_name
//           this.work_load_data.push(
//             {"id": 9+i,
//             "startTime": this.sh_startTime,

//             "Sun": "0",
//             "Mon": "0",
//             "Tue": "0",
//             "Wed": "0",
//             "Thu": "0",
//             "Fri": "0",
//             "Sat": "0",
//             "shiftName":this.shift_name,
//             "shiftCategory":this.allShiftData[i].sh_category_id,
//             "shift_created_by":this.allShiftData[i].sh_created_by,
//             "sh_include_exclude":this.allShiftData[i].sh_include_exclude
//           })
//             // this.allShift[i])

//         }
//       }
//
//       this.arrangeShiftdefintionG=[]
//       this.arrangeShiftdefintionL=[]
//         for(var i=0;i<this.work_load_data.length;i++){
//           if(Number(this.work_load_data[i].startTime)>2200){
//             this.arrangeShiftdefintionG.push(this.work_load_data[i])
//           }else if(Number(this.work_load_data[i].startTime)<=2200){
//             this.arrangeShiftdefintionL.push(this.work_load_data[i])
//           }
//         }
//         this.arrangeShiftdefintionG.sort((a,b) => a.startTime.localeCompare(b.startTime));
//         this.arrangeShiftdefintionL.sort((a,b) => a.startTime.localeCompare(b.startTime));
//         this.work_load_data=[]
//         for(var i=0;i<this.arrangeShiftdefintionG.length;i++){
//           this.work_load_data.push(this.arrangeShiftdefintionG[i])
//         }
//
//         for(var i=0;i<this.arrangeShiftdefintionL.length;i++){
//           this.work_load_data.push(this.arrangeShiftdefintionL[i])
//         }
//
//         localStorage.setItem('allShiftRequiredData',JSON.stringify(this.work_load_data))
//         localStorage.setItem('outliers',JSON.stringify({"shiftName":2300,"sun":0}))







// }
  start() {


    this.navCtrl.navigateForward(straightlines_io_apis.apis.enter_Work_load_api)
  }
  onClickFeedback(){
    // this.navCtrl.navigateForward('feedback')
    window.open('mailto:feedback@mercuriusinc.com?subject=Feedback: Straightlines.io');
  }

}
