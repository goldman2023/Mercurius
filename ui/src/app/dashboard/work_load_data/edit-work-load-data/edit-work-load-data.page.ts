import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { WorkLoadService } from 'src/app/services/work-load.service';
import workloadData from 'src/app/json/work-load-data.json';
import { Router } from '@angular/router';
import straightlines_io_apis from 'src/app/json/apis.json';
import { LocalDataService } from 'src/app/services/data/local-data.service';
@Component({
  selector: 'app-edit-work-load-data',
  templateUrl: './edit-work-load-data.page.html',
  styleUrls: ['./edit-work-load-data.page.scss'],
})
export class EditWorkLoadDataPage implements OnInit {

  data: any;
  workLoadData: any;
  workLoad= workloadData
  workLoadId: any;
  errorMsg: any;
  work=[] as any;
  result=[] as any
  finalResult=[]as any
  constructor(public modalCtrl: ModalController,
    public navParams: NavParams,
    private route:Router,
    private localData: LocalDataService,
    public viewCtrl: ModalController,
    public dataService:WorkLoadService,) {

    this.workLoadData=navParams.get('workLoadData')

   }

  ngOnInit() {
    this.work=JSON.parse(this.localData.getItem('workData'))



  }

  update(){


    for(var i=0;i<this.work.length;i++)
    {

      if(this.work[i].id!=this.workLoadData.id)
      {
        this.finalResult.push(this.work[i])

        // this.localData.setItem('workData',this.work)

      }
      else{
        this.finalResult.push(this.workLoadData)
      }


    }

    this.result =Object.assign(this.finalResult,this.workLoadData)

      this.localData.removeItem('workData')
      this.localData.removeItem('totalCountSummary')
      this.localData.setItem('workData',JSON.stringify(this.finalResult))
      this.localData.setItem('totalCountSummary',JSON.stringify(this.finalResult))
      window.location.reload()
            // this.modalCtrl.dismiss();
            this.route.navigateByUrl(straightlines_io_apis.apis.enter_Work_load_api)

  //   this.dataService.updateWorkLoadData(this.workLoadData.id,this.workLoadData).subscribe(
  //     (data: any)=>{
  //       this.workLoadData=data;

  //   },
  //   (error: any)=>this.errorMsg=error
  // );

  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
