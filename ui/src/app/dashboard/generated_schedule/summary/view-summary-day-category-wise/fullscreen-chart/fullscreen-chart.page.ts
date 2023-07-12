import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import Chart from 'chart.js';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
// import 'chartjs-plugin-zoom'

@Component({
  selector: 'app-fullscreen-chart',
  templateUrl: './fullscreen-chart.page.html',
  styleUrls: ['./fullscreen-chart.page.scss'],
})
export class FullscreenChartPage implements OnInit {
  chartData
day
hideMinHourChart=false
  chart_data_R=[]
  chart_data_G=[]
  result_R_G=[]
  Req=[]
  Gen=[]
  Shift=[]
  final_dataset=[]
height
width
current_day
tr=[]
  min_Shift=[]
  min_Gen=[]
  min_Req=[]
  min_chart_data_G=[]
  min_chart_data_R=[]
  min_final_dataset=[]
  current_day_summary_data
  re: any[];
  min_Result_R_G=[];
// @ViewChild('renderCanvas', { static: true }) renderCanvas: ElementRef;
  constructor(public modalCtrl: ModalController,
    public navParams: NavParams,) {
      // FullscreenChartPage.urlArray ="false";
      this.chartData=navParams.get('chartData')
      this.current_day_summary_data=this.chartData[6]

this.current_day=this.chartData[5]

if(this.current_day.id==0){
  this.day='Sunday'
}
else if(this.current_day.id==1){
  this.day='Monday'
}
else if(this.current_day.id==2){
  this.day='Tuesday'
}
else if(this.current_day.id==3){
  this.day='Wednesday'
}
else if(this.current_day.id==4){
  this.day='Thursday'
}
else if(this.current_day.id==5){
  this.day='Friday'
}
else if(this.current_day.id==6){
  this.day='Saturday'
}
    }

  ngOnInit() {

    // this.renderCanvas.nativeElement.height = window.innerHeight;
    // this.renderCanvas.nativeElement.width = window.innerWidth;
   const  lineChartOptions:ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position:'right',
      labels: {
        boxWidth:10,
          },
    },
    layout: {
      padding: {
        top:20,
        left:5,
        right:10,
          bottom: 1,
      }
  },
    scales: {
      xAxes: [{
      gridLines: {
        display: true,
      },
      ticks: {
        autoSkip: false,
        beginAtZero: true,
      },
    }],
    yAxes: [{
      gridLines: {
        display: true,
      },
      ticks: {
        beginAtZero: true,
      }
    }] },
    plugins: [{
      beforeInit: function(chart, options) {
        chart.legend.afterFit = function() {
          this.height = this.height + 150;
        };
      }
    }],

    "animation": {
      "duration": 1,
    "onComplete": function() {
      var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          var chartInstanceG = this.chart,
          ctx1 = chartInstanceG.ctx;

      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'center';
      ctx.fillStyle='rgba(135,110,235)'
      // ctx.height=500

      // this.data.datasets.forEach(function(dataset, i) {
      //   if(i==0){
      //   var meta = chartInstance.controller.getDatasetMeta(0);
      //   meta.data.forEach(function(bar, index) {
      //     var data = dataset.data[index];
      //     ctx.fillText(data, bar._model.x, bar._model.y - 10);
      //   });
      // }
      // });
      ctx1.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
      ctx1.textAlign = 'center';
      ctx1.textBaseline = 'center';
      ctx1.fillStyle='rgba(255,0,0)'
      // this.data.datasets.forEach(function(dataset, i) {
      //   if(i==1){
      //   var metaG = chartInstanceG.getDatasetMeta(1);
      //   metaG.data.forEach(function(line, index) {
      //       var data1 = dataset.data[index];
      //     ctx1.fillText(data1, line._model.x, line._model.y + 10);
      //   });
      // }
      // });

    }
  },

  };

 const lineChartData:ChartDataSets[] = [

  { data:this.chartData[0][0].data,
    label:'Required',
    backgroundColor:'rgba(135,110,235,0.2)',
    borderColor: 'rgba(135,110,235,0.5)',
    steppedLine:true,
  fill:true,
  pointBackgroundColor:'rgba(135,110,235)'
  },
  { data: this.chartData[0][1].data,
    label:'Generated',
    backgroundColor:'rgba(255,0,0,0.3)',
    borderColor: 'rgba(255,0,0,0.8)',
    steppedLine:true,
    fill:true,
    pointBackgroundColor:'rgba(255,0,0)'}
];
   const lineChartLabels: Label[] =this.chartData[1];


 const lineChartLegend = true;
 const lineChartType:ChartType = 'line';
 this.final_dataset=[lineChartData , lineChartLabels ,lineChartOptions ,lineChartType ,lineChartLegend]







 //15-mins
// var all_min_Shift=[]
// for(var i=0;i<=9;i++){
//   all_min_Shift.push("0"+i+"00")
//   all_min_Shift.push("0"+i+"15")
//   all_min_Shift.push("0"+i+"30")
//   all_min_Shift.push("0"+i+"45")
// }
// for(var i=10;i<=23;i++){
//   all_min_Shift.push(i+"00")
//   all_min_Shift.push(i+"15")
//   all_min_Shift.push(i+"30")
//   all_min_Shift.push(i+"45")
// }

// var all_min_chart_data=[]
// this.min_Result_R_G=[]
// for(var i=0;i<all_min_Shift.length;i++){
//   all_min_chart_data.push({'shiftName':(all_min_Shift[i]),'R':0,'G':0})
// }

// for(var i=0;i<this.current_day_summary_data.length;i++){
//
//   this.min_Result_R_G.push({'shiftName':this.current_day_summary_data[i].shiftName,'R':this.current_day_summary_data[i].shiftData.R,'G':this.current_day_summary_data[i].shiftData.G})
// }
// for(var i=0;i<all_min_chart_data.length;i++){
//   this.min_Result_R_G.push(all_min_chart_data[i])
// }
// var f
// f=this.min_Result_R_G.filter((v,i,a)=>a.findIndex(t=>(t.shiftName === v.shiftName ))===i)
// this.min_Result_R_G=f
// var sum=0
// this.re=[]
// var g,r

// for(var i=0;i<this.min_Result_R_G.length;i++){
// sum=sum+ + +Number(this.min_Result_R_G[i].R)
// this.re.push({'shiftName':this.min_Result_R_G[i].shiftName,'sum':sum})
// }

// for(var i=0;i<this.min_Result_R_G.length;i++){

// if(Number(this.min_Result_R_G[i].shiftName) % 100 ==0 ||  (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='15') || (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='30') || (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='45')){

// r=Number(this.min_Result_R_G[i].shiftName)+ - +800
// var sum1=0
// var result
// for(var j=0;j<this.min_Result_R_G.length;j++){
//   if(Number(this.min_Result_R_G[j].shiftName)>=r){
//     if(Number(this.min_Result_R_G[i].shiftName)>=Number(this.min_Result_R_G[j].shiftName)){
//       // if((Number(this.sun[i].shiftName) % 100 ==0  ) || Number(this.sun[i].shiftName)===0 ){
//       sum1=sum1+ + +this.min_Result_R_G[j].G
//       result={'shiftName':this.min_Result_R_G[i].shiftName,'sum':sum1}
//     // }
//   }
// }
// }
// this.min_chart_data_G.push({'shiftName':this.min_Result_R_G[i].shiftName,'sum':sum1})
// }
// }

// for(var i=0;i<this.min_Result_R_G.length;i++){
// if(Number(this.min_Result_R_G[i].shiftName) % 100 ==0 ||  (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='15') || (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='30') || (this.min_Result_R_G[i].shiftName[2]+this.min_Result_R_G[i].shiftName[3]=='45')){
// g=Number(this.min_Result_R_G[i].shiftName)+ - +800
// var sum2=0
// var result
// for(var j=0;j<this.min_Result_R_G.length;j++){
//   if(Number(this.min_Result_R_G[j].shiftName)>=g){
//     if(Number(this.min_Result_R_G[i].shiftName)>=Number(this.min_Result_R_G[j].shiftName)){
//       sum2=sum2+ + +this.min_Result_R_G[j].R
//       result={'shiftName':this.min_Result_R_G[i].shiftName,'sum':sum2}
//     }
//   }
// }
// this.min_chart_data_R.push({'shiftName':this.min_Result_R_G[i].shiftName,'sum':sum2})
// }
// }

// this.min_chart_data_R.sort(function(a, b){return a.shiftName - b.shiftName});
// this.min_chart_data_G.sort(function(a, b){return a.shiftName - b.shiftName});

// this.min_Shift=[]
// this.min_Gen=[]
// this.min_Req=[]
// for(var i=0;i<this.min_chart_data_G.length;i++){

// this.min_Gen.push(Number(this.min_chart_data_G[i].sum))
// this.min_Shift.push(this.min_chart_data_G[i].shiftName)
// }
// for(var i=0;i<this.min_chart_data_R.length;i++){

// this.min_Req.push(Number(this.min_chart_data_R[i].sum))

// }

// // this.S=["0000","0100"]




// const  min_lineChartOptions:ChartOptions = {
//   responsive: true,

//   // legend: {
//   //   labels: {
//   //     padding: 50
//   //   }
//   // },
//   legend: {

//     display: true,
//     // position:'right',
//     labels: {
//       boxWidth:10,
//       // padding: 10,
//         },


//   },
//   layout: {

//     padding: {
//       top:20,
//       left:5,
//       right:10,
//         bottom: 1,
//     }

// },


//   scales: {

//     xAxes: [{

//     gridLines: {

//       display: true,


//     },
//     ticks: {
//       autoSkip: false,
//       beginAtZero: true,

//     },

//   }],
//   yAxes: [{

//     gridLines: {
//       display: true,

//     },
//     ticks: {
//       // stepSize:1,
//       beginAtZero: true,
//       // autoSkip: false,
//     }
//   }] },
//   plugins: [{
//     beforeInit: function(chart, options) {
//       chart.legend.afterFit = function() {
//         this.height = this.height + 150;
//       };
//     }
//   }],

//   "animation": {
//     "duration": 1,
//   "onComplete": function() {
//     var chartInstance = this.chart,
//         ctx = chartInstance.ctx;
//         var chartInstanceG = this.chart,
//         ctx1 = chartInstanceG.ctx;

//     ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'center';
//     ctx.fillStyle='rgba(135,110,235)'
//     // ctx.height=500

//     this.data.datasets.forEach(function(dataset, i) {
//       if(i==0){
//       var meta = chartInstance.controller.getDatasetMeta(0);
//       meta.data.forEach(function(bar, index) {
//         var data = dataset.data[index];
//         ctx.fillText(data, bar._model.x, bar._model.y - 10);
//       });
//     }
//     });
//     ctx1.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
//     ctx1.textAlign = 'center';
//     ctx1.textBaseline = 'center';
//     ctx1.fillStyle='rgba(255,0,0)'
//     // var metaG=this.data.datasets[1]{

//     // }

//     this.data.datasets.forEach(function(dataset, i) {
//       if(i==1){
//       var metaG = chartInstanceG.getDatasetMeta(1);
//       metaG.data.forEach(function(line, index) {
//           var data1 = dataset.data[index];
//         ctx1.fillText(data1, line._model.x, line._model.y + 10);
//       });
//     }
//     });

//   }
// },

// };
// // this.data2=this.S;

// const min_lineChartData:ChartDataSets[] = [

// { data:this.min_Req,
// label:'Required',
// backgroundColor:'rgba(135,110,235,0)',
// borderColor: 'rgba(135,110,235)'},
// { data: this.min_Gen,
// label:'Generated',
// backgroundColor:'rgba(255,0,0,0)',
// borderColor: 'red',}
// ];
// const min_lineChartLabels: Label[] =this.min_Shift;


// const min_lineChartLegend = true;
// const min_lineChartType:ChartType = 'line';
// this.min_final_dataset=[min_lineChartData , min_lineChartLabels ,min_lineChartOptions ,min_lineChartType ,min_lineChartLegend]










 return this.final_dataset
//  this.min_final_dataset
  }
  // minHour(e){
  //   var hide_Min_Hour_Chart_toggle_button=e.detail.checked

  //   if(hide_Min_Hour_Chart_toggle_button==false){

  //     return this.hideMinHourChart=false
  //   }else if(hide_Min_Hour_Chart_toggle_button==true){


  //     return this.hideMinHourChart=true
  //   }
  // }
  dismiss(){
    this.modalCtrl.dismiss();
  }
  zoomIn(){
    var myImg = document.getElementById("chart");
    var currWidth = myImg.clientWidth;
    var currHeight = myImg.clientHeight;

    if (currWidth == 2500){ return false}
    else if(currHeight<175){
      myImg.style.height = (currHeight + 25) + "px";
      return false
    }else if(currHeight>175){
      myImg.style.width = (currWidth + 25) + "px";
      myImg.style.height = (currHeight + 25) + "px";
    }
    else {
      myImg.style.width = (currWidth + 25) + "px";
      // myImg.style.height = (currHeight + 25) + "px";
    }
  }
  zoomOut(){
    var myImg = document.getElementById("chart");
    var currWidth = myImg.clientWidth;
    var currHeight = myImg.clientHeight;


    if (currWidth < window.innerWidth)
    {
        return false
    }else if(currHeight<175){

      return false
    }else if(currHeight>175){
      myImg.style.width = (currWidth - 25) + "px";
      myImg.style.height = (currHeight - 25) + "px";
    }
    // return false;
    else {
      myImg.style.width = (currWidth - 25) + "px";
      // myImg.style.height = (currHeight - 25) + "px";
    }
  }
}

