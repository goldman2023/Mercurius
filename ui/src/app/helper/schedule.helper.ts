import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Buffer } from 'buffer';


@Injectable({
    providedIn: 'root'
  })
 
 export class GenerateScheduleHelper {
    constructor(
        public http : HttpClient,
    ){};
    _nextId
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    _chars
    rowCount=0

    next() {
        const r = [];
        for (const char of this._nextId) {
          r.unshift(this._chars[char]);
        }
        this._increment();
        return r.join('');
      }
    
    _increment() {
    for (let i = 0; i < this._nextId.length; i++) {
        const val = ++this._nextId[i];
        if (val >= this._chars.length) {
        this._nextId[i] = 0;
        } else {
        return;
        }
    }
    this._nextId.push(0);
    }

    convertRDOtoShiftDefintion(rdo,shiftlength,allShiftDataWithIncludeExclude,allShiftData){
    if(String(rdo)=='X' || String(rdo)=='x'){
        return rdo
    }
    else{
        for(var i=0;i<allShiftDataWithIncludeExclude.length;i++){
                if(Number(shiftlength)==9){
            if(String(allShiftData[i].shiftName)==String(rdo.split('-')[0]) && Number(rdo.split('-')[1])==Number(allShiftData[i].shift_duration)){
            return String(allShiftData[i].startTime)
            }
        }else {
            if (Number(shiftlength) == 10) {
              if (Number(rdo)) {
                if(String(allShiftData[i].shiftName)==`${String(rdo)}t` && Number(shiftlength)==Number(allShiftData[i].shift_duration)){
                  return String(allShiftData[i].startTime)
                }
              } else {
                if(String(allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(allShiftData[i].shift_duration)){
                  return String(allShiftData[i].startTime)
                }
              }
            } else {
              if(String(allShiftData[i].shiftName)==String(rdo) && Number(shiftlength)==Number(allShiftData[i].shift_duration)){
                return String(allShiftData[i].startTime)
              }
            }
     }
        }

    }
    }

    async export(
        allShiftDataWithIncludeExclude,
        allShiftData,
        shiftline_schedule_name,
        scheduleShift,
        rdosArr,
        defrdosArr,
        ReqVsGeneData,
        defscheduleShift,
        reqvsgenDataShiftTime,
        defReqVsGeneData,
        reqvsgenDefDataShiftTime,
        reqvsgenDataSun,
        reqvsgenDataMon,
        reqvsgenDataTue,
        reqvsgenDataWed,
        reqvsgenDataThu,
        reqvsgenDataFri,
        reqvsgenDataSat,
        reqvsgenDefDataSun,
        reqvsgenDefDataMon,
        reqvsgenDefDataTue,
        reqvsgenDefDataWed,
        reqvsgenDefDataThu,
        reqvsgenDefDataFri,
        reqvsgenDefDataSat,
        fileName,
        generated?:boolean
        )
        {
            const workbook = new Workbook();
        //Customized Schedule
    
        const header = ['Id','Shiftline Name','Duration', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu','Fri','Sat','Pattern'];
        var temp
        var tempMonth
        var allData=[]
        const worksheet = workbook.addWorksheet('Customized Schedule');
        const customizedimageData = await this.http.get('assets/img/mlog-email-template.png', { responseType: 'arraybuffer' }).toPromise();
            const customizedbase64Image = Buffer.from(customizedimageData).toString('base64');
            const logoCustomizedSchedule = workbook.addImage({
                base64: customizedbase64Image,
                extension: 'png',
            });
            worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.1, row: 0.2 },ext: { width: 50, height: 50 } });
        this.rowCount=1
                this._chars = this.chars;
                this._nextId = [0];
                temp=this.next()
                const compST=worksheet.getCell(temp+this.rowCount);
                compST.value="Shiftline Schedule "
                compST.alignment={ vertical: 'middle',horizontal: 'center'   }
                compST.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                compST.border = {right: {style:'thin'},bottom: {style:'thin'},top: {style:'thin'},left: {style:'thin'},}
                compST.font = {bold: true,  size: 22};
    
                var end
                for(var i=1;i<header.length;i++){
                end=this.next()
                }
                this.rowCount=this.rowCount+ + +3
                worksheet.mergeCells(temp+1+':'+end+this.rowCount);
                this.rowCount++
                var currentrowCount = this.rowCount;
                this._chars = this.chars;
                this._nextId = [0];
                // for(var i=0;i<header.length;i++){
                    temp=this.next()
                    const compT=worksheet.getCell(temp+this.rowCount);
                    compT.value=shiftline_schedule_name
                    compT.alignment={ vertical: 'middle',horizontal: 'center'   }
                    compT.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    compT.border = {right: {style:'thin'},bottom: {style:'thin'},left: {style:'thin'},}
                    compT.font = {size: 20};
                    var end
                    for(var i=1;i<header.length;i++){
                    end=this.next()
                    }
                    this.rowCount=this.rowCount+ + +2
                    worksheet.mergeCells(temp+currentrowCount+':'+end+this.rowCount);
                    this.rowCount++
                    // compT.border = {top: {style:'thin'},};
                    // if(i==(header.length+ - +1)){
                    // compT.border = {right: {style:'thin'},};
                    // }
                // }
                this._chars = this.chars;
                this._nextId = [0];
                    for(var i=0;i<header.length;i++){
                    temp=this.next()
                    const compT=worksheet.getCell(temp+this.rowCount);
                    compT.value=header[i]
                    compT.alignment={ vertical: 'middle',horizontal: 'center'   }
                    compT.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    compT.font = {bold: true};
    
                    compT.border = {top: {style:'thin'},};
                    if(i==(header.length+ - +1)){
                        compT.border = {right: {style:'thin'},};
                    }
                    }
                this._chars = this.chars;
                this._nextId = [0];
                var tempValue
                for(var i=0;i<scheduleShift.length;i++){
                if(i>0){
    
                    if(scheduleShift[i-1].shiftname!==scheduleShift[i].shiftname){
                    this.rowCount++
                    }
                }
                this.rowCount++
                this._chars = this.chars;
                this._nextId = [0];
                if(generated){

                    if(Number(scheduleShift[i].shiftdurationc)==9){
        
                        allData=[Number(scheduleShift[i].id)+ + +1,scheduleShift[i].SL+(Number(scheduleShift[i].seq)+ + +1),Number(scheduleShift[i].shiftdurationc),scheduleShift[i].Sun,scheduleShift[i].Mon,scheduleShift[i].Tue,scheduleShift[i].Wed,scheduleShift[i].Thu,scheduleShift[i].Fri,scheduleShift[i].Sat,scheduleShift[i].Sunshift2,scheduleShift[i].Monshift2,scheduleShift[i].Tueshift2,scheduleShift[i].Wedshift2,scheduleShift[i].Thushift2,scheduleShift[i].Frishift2,scheduleShift[i].Satshift2,scheduleShift[i].Pattern]
                    }else{
                        allData=[Number(scheduleShift[i].id)+ + +1,scheduleShift[i].SL+(Number(scheduleShift[i].seq)+ + +1),Number(scheduleShift[i].shiftdurationc),scheduleShift[i].Sun,scheduleShift[i].Mon,scheduleShift[i].Tue,scheduleShift[i].Wed,scheduleShift[i].Thu,scheduleShift[i].Fri,scheduleShift[i].Sat,scheduleShift[i].Pattern]
                    }
                }else{

                    if(Number(scheduleShift[i].shiftdurationc)==9){
        
                        allData=[Number(scheduleShift[i].seq_id)+ + +1,scheduleShift[i].SL+(Number(scheduleShift[i].seq)+ + +1),Number(scheduleShift[i].shiftdurationc),scheduleShift[i].Sun,scheduleShift[i].Mon,scheduleShift[i].Tue,scheduleShift[i].Wed,scheduleShift[i].Thu,scheduleShift[i].Fri,scheduleShift[i].Sat,scheduleShift[i].Sunshift2,scheduleShift[i].Monshift2,scheduleShift[i].Tueshift2,scheduleShift[i].Wedshift2,scheduleShift[i].Thushift2,scheduleShift[i].Frishift2,scheduleShift[i].Satshift2,scheduleShift[i].Pattern]
                    }else{
                        allData=[Number(scheduleShift[i].seq_id)+ + +1,scheduleShift[i].SL+(Number(scheduleShift[i].seq)+ + +1),Number(scheduleShift[i].shiftdurationc),scheduleShift[i].Sun,scheduleShift[i].Mon,scheduleShift[i].Tue,scheduleShift[i].Wed,scheduleShift[i].Thu,scheduleShift[i].Fri,scheduleShift[i].Sat,scheduleShift[i].Pattern]
                    }
                }
    
                for(var j=0;j<allData.length;j++){
    
                    if(Number(scheduleShift[i].shiftdurationc)==9){
                    if(j==10){
                        this._chars = this.chars;
                        this._nextId = [3];
                        this.rowCount++
                    }
                    }
                    temp=this.next()
                    const compData=worksheet.getCell(temp+this.rowCount);
                    if(Number(scheduleShift[i].shiftdurationc)==9){
                    if(j==0 || j==1 || j==2){
                        worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ + +1));
                        }
                        if((j+ + +1)==allData.length){
                        worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ - +1));
                        }
                    }
                        if(j!=0 && j!=1 && j!=2){
                        if( allData.length!=(j+ + +1)){
                            tempValue=String(this.convertRDOtoShiftDefintion(allData[j],scheduleShift[i].shiftdurationc,allShiftDataWithIncludeExclude,allShiftData))
                        }else{
                            tempValue=String(allData[j])
                        }
    
                        }else{
                        tempValue=String(allData[j])
                        }
    
                        if(tempValue=='X' || tempValue=='x'){
                        // compData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'adadad'}};
                        }
                        if(scheduleShift[i].BMLRule==true){
                        compData.font={color: {argb: "37F40B"}};
                        }
                        if(scheduleShift[i].BMLRule==false){
                        compData.font={color: {argb: "FF0000"}};
                        }
                        if(j==1){
                        const idCol = worksheet.getColumn(temp);
                        idCol.width = 15;
                        if(scheduleShift[i].SL=='SS' ||scheduleShift[i].SL=='SS-A' || scheduleShift[i]?.SL  == 'FSS' || scheduleShift[i]?.SL  == 'FSS-A'){
                            compData.font={color: {argb: "1EC29D"},bold: true};
                        }else if(scheduleShift[i].SL=='SM' ||scheduleShift[i].SL=='SM-A' || scheduleShift[i]?.SL  == 'SMS' || scheduleShift[i]?.SL  == 'SMS-A'){
                            compData.font={color: {argb: "FBB053"},bold: true};
                        }else if(scheduleShift[i].SL=='MT' ||scheduleShift[i].SL=='MT-A' || scheduleShift[i]?.SL  == 'SMT' || scheduleShift[i]?.SL  == 'SMT-A'){
                            compData.font={color: {argb: "F5696C"},bold: true};
                        }else if(scheduleShift[i].SL=='TW' ||scheduleShift[i].SL=='TW-A' || scheduleShift[i]?.SL  == 'MTW' || scheduleShift[i]?.SL  == 'MTW-A'){
                            compData.font={color: {argb: "9A5FA5"},bold: true};
                        }else if(scheduleShift[i]?.SL  == 'WT' || scheduleShift[i]?.SL  == 'WT-A' || scheduleShift[i]?.SL  == 'WTh' || scheduleShift[i]?.SL  == 'WTh-A' ||scheduleShift[i]?.SL  == 'TWT' || scheduleShift[i]?.SL  == 'TWT-A'||scheduleShift[i]?.SL  == 'TWTh' || scheduleShift[i]?.SL  == 'TWTh-A'){
                            compData.font={color: {argb: "6160CE"},bold: true};
                        }else if(scheduleShift[i]?.SL  == 'TF' || scheduleShift[i]?.SL  == 'TF-A' || scheduleShift[i]?.SL  == 'ThF' || scheduleShift[i]?.SL  == 'ThF-A' ||scheduleShift[i]?.SL  == 'WTF' || scheduleShift[i]?.SL  == 'WTF-A'||scheduleShift[i]?.SL  == 'WThF' || scheduleShift[i]?.SL  == 'WThF-A'){
                            compData.font={color: {argb: "0084FE"},bold: true};
                        }else if(scheduleShift[i].SL=='FS' ||scheduleShift[i].SL=='FS-A' || scheduleShift[i]?.SL  == 'TFS' || scheduleShift[i]?.SL  == 'TFS-A'||scheduleShift[i]?.SL  == 'ThFS' || scheduleShift[i]?.SL  == 'ThFS-A'){
                            compData.font={color: {argb: "5AC8FA"},bold: true};
                        }else{
                            compData.font={color: {argb: "000000"},bold: true};
                        }
                        }
    
                        if(Number(scheduleShift[i].shiftdurationc)==9){
                        if(j==0 || j==1 || j==2){
                            compData.value=tempValue
                        }
                        else if((j+ + +1)==allData.length){
                            compData.value=tempValue
                        }else{
                            if(tempValue=='X'){
                            compData.value=tempValue
                            }else{
                            if(allData[j]!=null && allData[j]!=undefined && allData[j]!='' && allData[j]!='X'){
                                compData.value= {
                                'richText': [
                                    {'text': tempValue},
                                    {'font': {'vertAlign': 'superscript'},'text': allData[j].split('-')[1]+'hr'},
                                ]
                                };
                            }else{
                                compData.value=tempValue
                            }
    
                            }
                        }
                        }
                        else{
                        compData.value=tempValue
                        }
                        compData.alignment={ vertical: 'middle', horizontal: 'center' };
                        if(i==0 && j==0){
                        compData.border = {left: {style:'thin'},top: {style:'thin'}};
                        }
                        if(i==0 && j!=0 && j<10){
                        compData.border = {top: {style:'thin'}};
                        }
    
                        if( j==(allData.length+ - +1)){
                        compData.border = {right: {style:'thin'}};
                        }
                        if(i==0 &&  j==(allData.length+ - +1)){
                        compData.border = {top: {style:'thin'},right: {style:'thin'}};
                        }
                        if(Number(scheduleShift[i].shiftdurationc)==9){
    
                        if( i==(scheduleShift.length+ - +1) && (j==0 || j==1 || j==2 || j>9)){
                            compData.border = {bottom: {style:'thin'}};
                        }
                        }else{
                        if( i==(scheduleShift.length+ - +1)){
    
                            compData.border = {bottom: {style:'thin'}};
                        }
                        }
                        if(allData.length==(j+ + +1)){
    
                        compData.border = {right: {style:'thin'}};
                        const idCol = worksheet.getColumn(temp);
                        idCol.width = 18;
                        }
                        if(allData.length==(j+ + +1) && i==0){
                        compData.border = {right: {style:'thin'},top: {style:'thin'},};
                        const idCol = worksheet.getColumn(temp);
                        idCol.width = 18;
                        }
                        if( i==(scheduleShift.length+ - +1) &&  j==(allData.length+ - +1)){
                        const idCol = worksheet.getColumn(temp);
                        idCol.width = 18;
                        compData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                        }
                    }
                }
                this.rowCount=1
                    var temp3,temp4
                    temp=this.next()
                    var tempColumnName
                    temp=this.next()
                    temp3=temp
                    const customized_total_shit_line_label = worksheet.getCell(temp+this.rowCount);
                    customized_total_shit_line_label.value = "Total Shift Lines";
                    customized_total_shit_line_label.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    customized_total_shit_line_label.alignment={ vertical: 'middle', horizontal: 'center' };
                    customized_total_shit_line_label.font = {bold: true};
                    var temp2=this.next()
                    temp4=temp2
                    customized_total_shit_line_label.border = {top: {style:'thin'},right: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                    worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
                    this.rowCount++
                    const  customized_total_shit_line = worksheet.getCell(temp+this.rowCount);
                    customized_total_shit_line.alignment={ vertical: 'middle', horizontal: 'center' };
                    customized_total_shit_line.value = scheduleShift.length;
                    customized_total_shit_line.border = {top: {style:'thin'},right: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                        worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
    
            this.rowCount++;this.rowCount++
            var allRDOdata=[]
            for(var s=0;s<rdosArr.length;s++){
    
                allRDOdata=[rdosArr[s].rdo,rdosArr[s].count]
                if(s==0){
                const rvsgDatad1=worksheet.getCell(temp+this.rowCount);
                rvsgDatad1.value='RDOs'
                const rvsgDatad2=worksheet.getCell(temp2+this.rowCount);
                    rvsgDatad2.value='Total'
                    rvsgDatad1.font = {bold: true};
                    rvsgDatad2.font = {bold: true};
                    rvsgDatad1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    rvsgDatad2.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    rvsgDatad1.alignment={ vertical: 'middle', horizontal: 'center' };
                    rvsgDatad2.alignment={ vertical: 'middle', horizontal: 'center' };
                    rvsgDatad1.border = {top: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                    rvsgDatad2.border = {top: {style:'thin'},right: {style:'thin'},bottom: {style:'thin'}};
                }
                this.rowCount++
                const rvsgData1=worksheet.getCell(temp+this.rowCount);
                rvsgData1.value=rdosArr[s].rdo
                const rvsgData2=worksheet.getCell(temp2+this.rowCount);
                    rvsgData2.value=rdosArr[s].count
                    rvsgData1.alignment={ vertical: 'middle', horizontal: 'center' };
                    rvsgData2.alignment={ vertical: 'middle', horizontal: 'center' };
                    rvsgData1.border = {left: {style:'thin'}};
                    rvsgData2.border =  {right: {style:'thin'}};
                    if(rdosArr[s].rdo=='SS' ||rdosArr[s].rdo=='SS-A' || rdosArr[s].rdo  == 'FSS' || rdosArr[s].rdo  == 'FSS-A'){
                        // rvsgData1.font={color: {argb: "1EC29D"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'1EC29D'}};
                    }else if(rdosArr[s].rdo=='SM' ||rdosArr[s].rdo=='SM-A' || rdosArr[s].rdo  == 'SMS' || rdosArr[s].rdo  == 'SMS-A'){
                        // rvsgData1.font={color: {argb: "FBB053"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'FBB053'}};
                    }else if(rdosArr[s].rdo=='MT' ||rdosArr[s].rdo=='MT-A' || rdosArr[s].rdo  == 'SMT' || rdosArr[s].rdo  == 'SMT-A'){
                        // rvsgData1.font={color: {argb: "F5696C"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'F5696C'}};
                    }else if(rdosArr[s].rdo=='TW' ||rdosArr[s].rdo=='TW-A' || rdosArr[s].rdo  == 'MTW' || rdosArr[s].rdo  == 'MTW-A'){
                        // rvsgData1.font={color: {argb: "9A5FA5"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'9A5FA5'}};
                    }else if(rdosArr[s].rdo  == 'WT' || rdosArr[s].rdo  == 'WT-A' || rdosArr[s].rdo  == 'WTh' || rdosArr[s].rdo  == 'WTh-A' ||rdosArr[s].rdo  == 'TWT' || rdosArr[s].rdo  == 'TWT-A'||rdosArr[s].rdo  == 'TWTh' || rdosArr[s].rdo  == 'TWTh-A'){
                        // rvsgData1.font={color: {argb: "6160CE"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'6160CE'}};
                    }else if(rdosArr[s].rdo  == 'TF' || rdosArr[s].rdo  == 'TF-A' || rdosArr[s].rdo  == 'ThF' || rdosArr[s].rdo  == 'ThF-A' ||rdosArr[s].rdo  == 'WTF' || rdosArr[s].rdo  == 'WTF-A'||rdosArr[s].rdo  == 'WThF' || rdosArr[s].rdo  == 'WThF-A'){
                        // rvsgData1.font={color: {argb: "0084FE"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'0084FE'}};
                    }else if(rdosArr[s].rdo=='FS' ||rdosArr[s].rdo=='FS-A' || rdosArr[s].rdo  == 'TFS' || rdosArr[s].rdo  == 'TFS-A'||rdosArr[s].rdo  == 'ThFS' || rdosArr[s].rdo  == 'ThFS-A'){
                        // rvsgData1.font={color: {argb: "5AC8FA"},bold: true};
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'5AC8FA'}};
                    }else{
                        rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                        rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'000000'}};
                    }
                    if(s==0){
                    rvsgData1.border = {top: {style:'thin'},left: {style:'thin'}};
                    rvsgData2.border = {top: {style:'thin'},right: {style:'thin'}};
                    }
                    if(s+ + +1==rdosArr.length){
                    rvsgData1.border = {bottom: {style:'thin'},left: {style:'thin'}};
                    rvsgData2.border = {bottom: {style:'thin'},right: {style:'thin'}};
                    }
    
    
            }
            var tempBLRule=temp2
            this.rowCount=1
            tempBLRule=this.next()
            tempColumnName=tempBLRule
            tempBLRule=this.next()
            temp=tempBLRule
            const customized_BLRule_label_color_red = worksheet.getCell(tempBLRule+this.rowCount);
            customized_BLRule_label_color_red.value = '';
            customized_BLRule_label_color_red.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'FF0000'}};
            customized_BLRule_label_color_red.alignment={ vertical: 'middle', horizontal: 'center' };
            customized_BLRule_label_color_red.font = {bold: true};
            customized_BLRule_label_color_red.border = {top: {style:'thin'},left: {style:'thin'}};
                this.rowCount++
            const customized_BLRule_label_color_green = worksheet.getCell(tempBLRule+this.rowCount);
            customized_BLRule_label_color_green.value = '';
            customized_BLRule_label_color_green.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'37F40B'}};
            customized_BLRule_label_color_green.alignment={ vertical: 'middle', horizontal: 'center' };
            customized_BLRule_label_color_green.font = {bold: true};
            customized_BLRule_label_color_green.border = {bottom: {style:'thin'},left: {style:'thin'}};
            tempBLRule=this.next()
            this.rowCount=1
            const customized_BLRule_label_false = worksheet.getCell(tempBLRule+this.rowCount);
            customized_BLRule_label_false.value = 'Business rules not met';
            customized_BLRule_label_false.alignment={ vertical: 'middle', horizontal: 'center' };
            customized_BLRule_label_false.font = {bold: true};
            customized_BLRule_label_false.border = {top: {style:'thin'},right: {style:'thin'}};
            var mtempBLRule=this.next();mtempBLRule=this.next();mtempBLRule=this.next()
            worksheet.mergeCells(tempBLRule+this.rowCount+':'+mtempBLRule+this.rowCount);
            this.rowCount++
            const customized_BLRule_label_true = worksheet.getCell(tempBLRule+this.rowCount);
            customized_BLRule_label_true.value = 'Business rules met';
            customized_BLRule_label_true.alignment={ vertical: 'middle', horizontal: 'center' };
            customized_BLRule_label_true.font = {bold: true};
            customized_BLRule_label_true.border = {bottom: {style:'thin'},right: {style:'thin'}};
            worksheet.mergeCells(tempBLRule+this.rowCount+':'+mtempBLRule+this.rowCount);
    
                        this.rowCount++
                        this.rowCount++
                        const  customized_required_vs_generated_title=worksheet.getCell(temp+this.rowCount)
                    customized_required_vs_generated_title.alignment={ vertical: 'middle', horizontal: 'center' };
                    customized_required_vs_generated_title.value="Required vs System Generated Workforce (Shift Category)"
                    customized_required_vs_generated_title.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    customized_required_vs_generated_title.font = {bold: true};
                    // for(var i=0;i<6;i++){
                    //   temp2=this.next()
                    // }
                    for(var i=0;i<3;i++){
                        mtempBLRule=this.next()
                    }
                    worksheet.mergeCells(temp+this.rowCount+':'+mtempBLRule+this.rowCount);
    
    
                        for(var s=0;s<ReqVsGeneData.length;s++){
                            this.rowCount++
                            this._chars = this.chars.split(tempColumnName)[1]
                            this._nextId=[0]
                            for(var t=0;t<ReqVsGeneData[s].length;t++){
                            temp2=this.next()
                                const rvsgData=worksheet.getCell(temp2+this.rowCount);
                                rvsgData.value=ReqVsGeneData[s][t]
                                if(s==0){
                                rvsgData.font = {bold: true};
                                rvsgData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                                }
                                rvsgData.alignment={ vertical: 'middle', horizontal: 'center' };
                                if(t==0){
                                rvsgData.border = {left: {style:'thin'}};
                                }
                                if(s==0 && t==0){
                                rvsgData.border = {left: {style:'thin'},top: {style:'thin'}};
                                }
                                if(s==0 && t!=0){
                                rvsgData.border = {top: {style:'thin'}};
                                }
                                if(t==(ReqVsGeneData[s].length+ - +1)){
                                rvsgData.border = {right: {style:'thin'}};
                                }
                                if(s==0 &&  t==(ReqVsGeneData[s].length+ - +1)){
                                rvsgData.border = {top: {style:'thin'},right: {style:'thin'}};
                                }
                                if( s==(ReqVsGeneData.length+ - +1)){
                                rvsgData.border = {bottom: {style:'thin'}};
                                }
    
                                if(s==(ReqVsGeneData.length+ - +1) && t==0){
                                rvsgData.border = {left: {style:'thin'},bottom: {style:'thin'}};
                                }
                                if( t==(ReqVsGeneData[s].length+ - +1) &&  s==(ReqVsGeneData.length+ - +1)){
                                rvsgData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                                }
                            }
                        }
    
                        this.rowCount++
                        this.rowCount++
                        this._chars = this.chars.split(tempColumnName)[1]
                        this._nextId=[0]
                    const  customized_required_title=worksheet.getCell(temp+this.rowCount)
                    customized_required_title.alignment={ vertical: 'middle', horizontal: 'center' };
                    customized_required_title.value="Required Workforce vs System Generated Workforce (Shift Time)"
                    customized_required_title.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    customized_required_title.font = {bold: true};
                    for(var i=0;i<10;i++){
                        temp2=this.next()
                    }
                    worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
                    for(var i=0;i<reqvsgenDataShiftTime.length;i++){
                        this.rowCount++
                        this._chars = this.chars.split(tempColumnName)[1]
                        this._nextId=[0]
                        var ccheckDisable=false
                        if(generated){

                            if(reqvsgenDataSun[i]==0 && reqvsgenDataMon[i]==0 && reqvsgenDataTue[i]==0 && reqvsgenDataWed[i]==0 && reqvsgenDataThu[i]==0 && reqvsgenDataFri[i]==0 && reqvsgenDataSat[i]==0){
                            ccheckDisable=true
                            }else{
                            ccheckDisable=false
                            }
                            allData=[reqvsgenDataShiftTime[i].shift_start,reqvsgenDataShiftTime[i].shift_length,reqvsgenDataShiftTime[i].shift_name,reqvsgenDataSun[i],reqvsgenDataMon[i],reqvsgenDataTue[i],reqvsgenDataWed[i],reqvsgenDataThu[i],reqvsgenDataFri[i],reqvsgenDataSat[i]]
                        }else{

                            if(reqvsgenDataSun[i].Sun==0 && reqvsgenDataMon[i].Mon==0 && reqvsgenDataTue[i].Tue==0 && reqvsgenDataWed[i].Wed==0 && reqvsgenDataThu[i].Thu==0 && reqvsgenDataFri[i].Fri==0 && reqvsgenDataSat[i].Sat==0){
                            ccheckDisable=true
                            }else{
                            ccheckDisable=false
                            }
                            allData=[reqvsgenDataShiftTime[i].shift_start,reqvsgenDataShiftTime[i].shift_length,reqvsgenDataShiftTime[i].shift_name,reqvsgenDataSun[i].Sun,reqvsgenDataMon[i].Mon,reqvsgenDataTue[i].Tue,reqvsgenDataWed[i].Wed,reqvsgenDataThu[i].Thu,reqvsgenDataFri[i].Fri,reqvsgenDataSat[i].Sat]
                        }
                        for(var j=0;j<allData.length;j++){
                            temp2=this.next()
                            const compData=worksheet.getCell(temp2+this.rowCount);
                            if(j==2){
                            const idCol = worksheet.getColumn(temp2);
                            idCol.width = 15;
                            }
                            tempValue=String(allData[j])
                            compData.value=tempValue
                            compData.alignment={ vertical: 'middle', horizontal: 'center' };
                            if(i==0){
                            compData.font = {bold: true};
                            compData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                            }
                            if(j==0){
                            compData.border = {left: {style:'thin'}};
                            }
                            if(i==0 && j==0){
                            compData.border = {left: {style:'thin'},top: {style:'thin'}};
                            }
                            if(i==0 && j!=0){
                            compData.border = {top: {style:'thin'}};
                            }
    
                            if( j==(allData.length+ - +1)){
                            compData.border = {right: {style:'thin'}};
                            }
    
                            if(i==0 &&  j==(allData.length+ - +1)){
                            compData.border = {top: {style:'thin'},right: {style:'thin'}};
                            }
                            if( i==(reqvsgenDataShiftTime.length+ - +1)){
                            compData.border = {bottom: {style:'thin'}};
                            }
                            if( i==(reqvsgenDataShiftTime.length+ - +1) &&  j==(allData.length+ - +1)){
                            compData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                            }
    
                            if(i==(reqvsgenDataShiftTime.length+ - +1) && j==0){
                            compData.border = {left: {style:'thin'},bottom: {style:'thin'}};
                            }
                            if(ccheckDisable==true ){
                            compData.font={color: {argb: "696969"}};
                            }
                        }
                    }
    
                        const def_worksheet = workbook.addWorksheet('System Generated Schedule');
                        def_worksheet.addImage(logoCustomizedSchedule, { tl: {col: 0.1, row: 0.2 },ext: { width: 50, height: 50 } });
            this.rowCount=1
                    this._chars = this.chars;
                    this._nextId = [0];
                    temp=this.next()
                    const compDST=def_worksheet.getCell(temp+this.rowCount);
                    compDST.value="Shiftline Schedule "
                    compDST.alignment={ vertical: 'middle',horizontal: 'center'   }
                    compDST.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    compDST.border = {right: {style:'thin'},top: {style:'thin'},left: {style:'thin'},}
                    compDST.font = {bold: true,  size: 22};
    
                    var end
                    for(var i=1;i<header.length;i++){
                        end=this.next()
                    }
                    this.rowCount=this.rowCount+ + +2
                    def_worksheet.mergeCells(temp+1+':'+end+this.rowCount);
                    this.rowCount++
                    var currentrowDCount= this.rowCount
    
                    this._chars = this.chars;
                    this._nextId = [0];
                    temp=this.next()
                    const compDSTName=def_worksheet.getCell(temp+this.rowCount);
                    compDSTName.value=shiftline_schedule_name
                    compDSTName.alignment={ vertical: 'middle',horizontal: 'center'   }
                    compDSTName.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    compDSTName.border = {right: {style:'thin'},bottom: {style:'thin'},left: {style:'thin'},}
                    compDSTName.font = {  size: 20};
    
                    var end
                    for(var i=1;i<header.length;i++){
                        end=this.next()
                    }
    
                    this.rowCount=this.rowCount+ + +2
                    def_worksheet.mergeCells(temp+currentrowDCount+':'+end+this.rowCount);
    
    
    
    
                    this.rowCount++
                    this._chars = this.chars;
                    this._nextId = [0];
                        for(var i=0;i<header.length;i++){
                        temp=this.next()
                        const compT=def_worksheet.getCell(temp+this.rowCount);
                        compT.value=header[i]
                        compT.alignment={ vertical: 'middle',horizontal: 'center'   }
                        compT.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                        compT.font = {bold: true};
    
                        compT.border = {top: {style:'thin'},};
                        if(i==(header.length+ - +1)){
                            compT.border = {right: {style:'thin'},};
                        }
                        }
    
                    this._chars = this.chars;
                    this._nextId = [0];
                    var tempValue
                    for(var i=0;i<defscheduleShift.length;i++){
                        if(i>0){
    
                        if(defscheduleShift[i-1].shiftname!==defscheduleShift[i].shiftname){
                            this.rowCount++
                        }
                        }
                        this.rowCount++
                        this._chars = this.chars;
                        this._nextId = [0];
                        if(Number(defscheduleShift[i].shiftdurationc)==9){
    
                        allData=[Number(defscheduleShift[i].seq_id)+ + +1,defscheduleShift[i].SL+(Number(defscheduleShift[i].seq)+ + +1),Number(defscheduleShift[i].shiftdurationc),defscheduleShift[i].Sun,defscheduleShift[i].Mon,defscheduleShift[i].Tue,defscheduleShift[i].Wed,defscheduleShift[i].Thu,defscheduleShift[i].Fri,defscheduleShift[i].Sat,defscheduleShift[i].Sunshift2,defscheduleShift[i].Monshift2,defscheduleShift[i].Tueshift2,defscheduleShift[i].Wedshift2,defscheduleShift[i].Thushift2,defscheduleShift[i].Frishift2,defscheduleShift[i].Satshift2,defscheduleShift[i].Pattern]
                        }else{
                        allData=[Number(defscheduleShift[i].seq_id)+ + +1,defscheduleShift[i].SL+(Number(defscheduleShift[i].seq)+ + +1),Number(defscheduleShift[i].shiftdurationc),defscheduleShift[i].Sun,defscheduleShift[i].Mon,defscheduleShift[i].Tue,defscheduleShift[i].Wed,defscheduleShift[i].Thu,defscheduleShift[i].Fri,defscheduleShift[i].Sat,defscheduleShift[i].Pattern]
                        }
                        for(var j=0;j<allData.length;j++){
    
                            if(Number(defscheduleShift[i].shiftdurationc)==9){
                            if(j==10){
                                this._chars = this.chars;
                                this._nextId = [3];
                                this.rowCount++
                            }
                            }
                            temp=this.next()
                            const defcompData=def_worksheet.getCell(temp+this.rowCount);
                            if(Number(defscheduleShift[i].shiftdurationc)==9){
                            if(j==0 || j==1 || j==2){
                                def_worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ + +1));
                                }
                                if((j+ + +1)==allData.length){
                                def_worksheet.mergeCells(temp+this.rowCount+':'+temp+(this.rowCount+ - +1));
                                }
                            }
    
                            if(j!=0 && j!=1 && j!=2){
                            if( allData.length!=(j+ + +1)){
                                tempValue=String(this.convertRDOtoShiftDefintion(allData[j],defscheduleShift[i].shiftdurationc,allShiftDataWithIncludeExclude,allShiftData))
                            }else{
                                tempValue=String(allData[j])
                            }
    
                            }else{
                            tempValue=String(allData[j])
                            }
                            if(tempValue=='X' || tempValue=='x'){
                            }
                            if(defscheduleShift[i].BMLRule==true){
                            defcompData.font={color: {argb: "37F40B"}};
                            }
                            if(defscheduleShift[i].BMLRule==false){
                            defcompData.font={color: {argb: "FF0000"}};
                            }
                            if(j==1){
                            const idCol = def_worksheet.getColumn(temp);
                            idCol.width = 15;
                            if(defscheduleShift[i].SL=='SS' ||defscheduleShift[i].SL=='SS-A' || defscheduleShift[i]?.SL  == 'FSS' || defscheduleShift[i]?.SL  == 'FSS-A'){
                                defcompData.font={color: {argb: "1EC29D"},bold: true};
                            }else if(defscheduleShift[i].SL=='SM' ||defscheduleShift[i].SL=='SM-A' || defscheduleShift[i]?.SL  == 'SMS' || defscheduleShift[i]?.SL  == 'SMS-A'){
                                defcompData.font={color: {argb: "FBB053"},bold: true};
                            }else if(defscheduleShift[i].SL=='MT' ||defscheduleShift[i].SL=='MT-A' || defscheduleShift[i]?.SL  == 'SMT' || defscheduleShift[i]?.SL  == 'SMT-A'){
                                defcompData.font={color: {argb: "F5696C"},bold: true};
                            }else if(defscheduleShift[i].SL=='TW' ||defscheduleShift[i].SL=='TW-A' || defscheduleShift[i]?.SL  == 'MTW' || defscheduleShift[i]?.SL  == 'MTW-A'){
                                defcompData.font={color: {argb: "9A5FA5"},bold: true};
                            }else if(defscheduleShift[i]?.SL  == 'WT' || defscheduleShift[i]?.SL  == 'WT-A' || defscheduleShift[i]?.SL  == 'WTh' || defscheduleShift[i]?.SL  == 'WTh-A' ||defscheduleShift[i]?.SL  == 'TWT' || defscheduleShift[i]?.SL  == 'TWT-A'||defscheduleShift[i]?.SL  == 'TWTh' || defscheduleShift[i]?.SL  == 'TWTh-A'){
                                defcompData.font={color: {argb: "6160CE"},bold: true};
                            }else if(defscheduleShift[i]?.SL  == 'TF' || defscheduleShift[i]?.SL  == 'TF-A' || defscheduleShift[i]?.SL  == 'ThF' || defscheduleShift[i]?.SL  == 'ThF-A' ||defscheduleShift[i]?.SL  == 'WTF' || defscheduleShift[i]?.SL  == 'WTF-A'||defscheduleShift[i]?.SL  == 'WThF' || defscheduleShift[i]?.SL  == 'WThF-A'){
                                defcompData.font={color: {argb: "0084FE"},bold: true};
                            }else if(defscheduleShift[i].SL=='FS' ||defscheduleShift[i].SL=='FS-A' || defscheduleShift[i]?.SL  == 'TFS' || defscheduleShift[i]?.SL  == 'TFS-A'||defscheduleShift[i]?.SL  == 'ThFS' || defscheduleShift[i]?.SL  == 'ThFS-A'){
                                defcompData.font={color: {argb: "5AC8FA"},bold: true};
                            }else{
                                defcompData.font={color: {argb: "000000"},bold: true};
                            }
                            }
                            if(Number(defscheduleShift[i].shiftdurationc)==9){
                            if(j==0 || j==1 || j==2){
                                defcompData.value=tempValue
                            }
                            else if((j+ + +1)==allData.length){
                                defcompData.value=tempValue
                            }else{
                                if(tempValue=='X'){
                                defcompData.value=tempValue
                                }else{
                                if(allData[j]!=null && allData[j]!=undefined && allData[j]!='' && allData[j]!='X'){
                                    defcompData.value= {
                                    'richText': [
                                        {'text': tempValue},
                                        {'font': {'vertAlign': 'superscript'},'text': allData[j].split('-')[1]+'hr'},
                                    ]
                                    };
                                }else{
                                    defcompData.value=tempValue
                                }
    
                                }
                            }
                            }
                            else{
                            defcompData.value=tempValue
                            }
    
                            defcompData.alignment={ vertical: 'middle', horizontal: 'center' };
                            if(i==0 && j==0){
                            defcompData.border = {left: {style:'thin'},top: {style:'thin'}};
                            }
                            if(i==0 && j!=0 && j<10){
                            defcompData.border = {top: {style:'thin'}};
                            }
    
                            if( j==(allData.length+ - +1)){
                            defcompData.border = {right: {style:'thin'}};
                            }
                            if(i==0 &&  j==(allData.length+ - +1)){
                            defcompData.border = {top: {style:'thin'},right: {style:'thin'}};
                            }
                            if(Number(defscheduleShift[i].shiftdurationc)==9){
                            if( i==(defscheduleShift.length+ - +1) && (j==0 || j==1 || j==2 || j>9)){
                                defcompData.border = {bottom: {style:'thin'}};
                            }
                            }else{
                            if( i==(defscheduleShift.length+ - +1)){
                                defcompData.border = {bottom: {style:'thin'}};
                            }
                            }
                            if(allData.length==(j+ + +1)){
                            defcompData.border = {right: {style:'thin'}};
                            const idCol = def_worksheet.getColumn(temp);
                            idCol.width = 18;
                            }
                            if(allData.length==(j+ + +1) && i==0){
                            defcompData.border = {right: {style:'thin'},top: {style:'thin'},};
                            const idCol = def_worksheet.getColumn(temp);
                            idCol.width = 18;
                            }
                            if( i==(defscheduleShift.length+ - +1) &&  j==(allData.length+ - +1)){
                            const idCol = def_worksheet.getColumn(temp);
                            idCol.width = 18;
                            defcompData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                            }
    
                        }
                    }
                    this.rowCount=1
                    var temp3,temp4
                    temp=this.next()
                    var tempColumnName
                    temp=this.next()
                    temp3=temp
    
                    const def_customized_total_shit_line_label = def_worksheet.getCell(temp+this.rowCount);
                    def_customized_total_shit_line_label.value = "Total Shift Lines";
                    def_customized_total_shit_line_label.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    def_customized_total_shit_line_label.alignment={ vertical: 'middle', horizontal: 'center' };
                    def_customized_total_shit_line_label.font = {bold: true};
                    var temp2=this.next()
                    def_customized_total_shit_line_label.border = {top: {style:'thin'},right: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                    def_worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
                    this.rowCount++
                        const  def_customized_total_shit_line = def_worksheet.getCell(temp+this.rowCount);
                        def_customized_total_shit_line.alignment={ vertical: 'middle', horizontal: 'center' };
                        def_customized_total_shit_line.value = defscheduleShift.length;
                        def_customized_total_shit_line.border = {top: {style:'thin'},right: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                        def_worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
                        this.rowCount++;this.rowCount++
                        var allRDOdata=[]
                        for(var s=0;s<defrdosArr.length;s++){
    
                        if(s==0){
                            const rvsgDatad1=def_worksheet.getCell(temp+this.rowCount);
                            rvsgDatad1.value='RDOs'
                            const rvsgDatad2=def_worksheet.getCell(temp2+this.rowCount);
                            rvsgDatad2.value='Total'
                            rvsgDatad1.font = {bold: true};
                            rvsgDatad2.font = {bold: true};
                            rvsgDatad1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                            rvsgDatad2.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                            rvsgDatad1.alignment={ vertical: 'middle', horizontal: 'center' };
                            rvsgDatad2.alignment={ vertical: 'middle', horizontal: 'center' };
                            rvsgDatad1.border = {top: {style:'thin'},left: {style:'thin'},bottom: {style:'thin'}};
                            rvsgDatad2.border = {top: {style:'thin'},right: {style:'thin'},bottom: {style:'thin'}};
                        }
                        this.rowCount++
                            const rvsgData1=def_worksheet.getCell(temp+this.rowCount);
                            rvsgData1.value=defrdosArr[s].rdo
                            const rvsgData2=def_worksheet.getCell(temp2+this.rowCount);
                            rvsgData2.value=defrdosArr[s].count
                            rvsgData1.alignment={ vertical: 'middle', horizontal: 'center' };
                            rvsgData2.alignment={ vertical: 'middle', horizontal: 'center' };
                                rvsgData1.border = {left: {style:'thin'}};
                                rvsgData2.border =  {right: {style:'thin'}};
                                if(defrdosArr[s].rdo=='SS' ||defrdosArr[s].rdo=='SS-A' || defrdosArr[s].rdo  == 'FSS' || defrdosArr[s].rdo  == 'FSS-A'){
                                // rvsgData1.font={color: {argb: "1EC29D"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'1EC29D'}};
                                }else if(defrdosArr[s].rdo=='SM' ||defrdosArr[s].rdo=='SM-A' || defrdosArr[s].rdo  == 'SMS' || defrdosArr[s].rdo  == 'SMS-A'){
                                // rvsgData1.font={color: {argb: "FBB053"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'FBB053'}};
                                }else if(defrdosArr[s].rdo=='MT' ||defrdosArr[s].rdo=='MT-A' || defrdosArr[s].rdo  == 'SMT' || defrdosArr[s].rdo  == 'SMT-A'){
                                // rvsgData1.font={color: {argb: "F5696C"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'F5696C'}};
                                }else if(defrdosArr[s].rdo=='TW' ||defrdosArr[s].rdo=='TW-A' || defrdosArr[s].rdo  == 'MTW' || defrdosArr[s].rdo  == 'MTW-A'){
                                // rvsgData1.font={color: {argb: "9A5FA5"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'9A5FA5'}};
                                }else if(defrdosArr[s].rdo  == 'WT' || defrdosArr[s].rdo  == 'WT-A' || defrdosArr[s].rdo  == 'WTh' || defrdosArr[s].rdo  == 'WTh-A' ||defrdosArr[s].rdo  == 'TWT' || defrdosArr[s].rdo  == 'TWT-A'||defrdosArr[s].rdo  == 'TWTh' || defrdosArr[s].rdo  == 'TWTh-A'){
                                // rvsgData1.font={color: {argb: "6160CE"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'6160CE'}};
                                }else if(defrdosArr[s].rdo  == 'TF' || defrdosArr[s].rdo  == 'TF-A' || defrdosArr[s].rdo  == 'ThF' || defrdosArr[s].rdo  == 'ThF-A' ||defrdosArr[s].rdo  == 'WTF' || defrdosArr[s].rdo  == 'WTF-A'||defrdosArr[s].rdo  == 'WThF' || defrdosArr[s].rdo  == 'WThF-A'){
                                // rvsgData1.font={color: {argb: "0084FE"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'0084FE'}};
                                }else if(defrdosArr[s].rdo=='FS' ||defrdosArr[s].rdo=='FS-A' || defrdosArr[s].rdo  == 'TFS' || defrdosArr[s].rdo  == 'TFS-A'||defrdosArr[s].rdo  == 'ThFS' || defrdosArr[s].rdo  == 'ThFS-A'){
                                // rvsgData1.font={color: {argb: "5AC8FA"},bold: true};
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'5AC8FA'}};
                                }else{
                                rvsgData1.font={color: {argb: "FFFFFF"},bold: true};
                                rvsgData1.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'000000'}};
                                }
                            if(s==0){
                                rvsgData1.border = {top: {style:'thin'},left: {style:'thin'}};
                                rvsgData2.border = {top: {style:'thin'},right: {style:'thin'}};
                            }
                            if(s+ + +1==defrdosArr.length){
                                rvsgData1.border = {bottom: {style:'thin'},left: {style:'thin'}};
                                rvsgData2.border = {bottom: {style:'thin'},right: {style:'thin'}};
                            }
    
    
                        }
                        var tempBLRule=temp2
                        this.rowCount=3
                        tempBLRule=this.next()
                        tempColumnName=tempBLRule
                        tempBLRule=this.next()
                        temp=tempBLRule
                        this.rowCount++
                        const  def_customized_required_vs_generated_title=def_worksheet.getCell(temp+this.rowCount)
                        def_customized_required_vs_generated_title.alignment={ vertical: 'middle', horizontal: 'center' };
                        def_customized_required_vs_generated_title.value="Required vs System Generated Workforce (Shift Category)"
                        def_customized_required_vs_generated_title.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                        def_customized_required_vs_generated_title.font = {bold: true};
                    for(var i=0;i<7;i++){
                        temp2=this.next()
                    }
                    def_worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
    
                        for(var s=0;s<defReqVsGeneData.length;s++){
                            this.rowCount++
                            this._chars = this.chars.split(tempColumnName)[1]
                            this._nextId=[0]
                            for(var t=0;t<defReqVsGeneData[s].length;t++){
                            temp2=this.next()
                                const def_rvsgData=def_worksheet.getCell(temp2+this.rowCount);
                                def_rvsgData.value=defReqVsGeneData[s][t]
                                if(s==0){
                                def_rvsgData.font = {bold: true};
                                def_rvsgData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                                }
                                def_rvsgData.alignment={ vertical: 'middle', horizontal: 'center' };
                                if(t==0){
                                def_rvsgData.border = {left: {style:'thin'}};
                                }
                                if(s==0 && t==0){
                                def_rvsgData.border = {left: {style:'thin'},top: {style:'thin'}};
                                }
                                if(s==0 && t!=0){
                                def_rvsgData.border = {top: {style:'thin'}};
                                }
                                if(t==(defReqVsGeneData[s].length+ - +1)){
                                def_rvsgData.border = {right: {style:'thin'}};
                                }
                                if(s==0 &&  t==(defReqVsGeneData[s].length+ - +1)){
                                def_rvsgData.border = {top: {style:'thin'},right: {style:'thin'}};
                                }
                                if( s==(defReqVsGeneData.length+ - +1)){
                                def_rvsgData.border = {bottom: {style:'thin'}};
                                }
    
                                if(s==(defReqVsGeneData.length+ - +1) && t==0){
                                def_rvsgData.border = {left: {style:'thin'},bottom: {style:'thin'}};
                                }
                                if( t==(defReqVsGeneData[s].length+ - +1) &&  s==(defReqVsGeneData.length+ - +1)){
                                def_rvsgData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                                }
                            }
                        }
    
                        this.rowCount++
                        this.rowCount++
                        this._chars = this.chars.split(tempColumnName)[1]
                        this._nextId=[0]
                    const  def_customized_required_title=def_worksheet.getCell(temp+this.rowCount)
                    def_customized_required_title.alignment={ vertical: 'middle', horizontal: 'center' };
                    def_customized_required_title.value="Required Workforce vs System Generated Workforce (Shift Time)"
                    def_customized_required_title.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                    def_customized_required_title.font = {bold: true};
                    for(var i=0;i<10;i++){
                        temp2=this.next()
                    }
                    def_worksheet.mergeCells(temp+this.rowCount+':'+temp2+this.rowCount);
                    for(var i=0;i<reqvsgenDefDataShiftTime.length;i++){
                        this.rowCount++
                        this._chars = this.chars.split(tempColumnName)[1]
                        this._nextId=[0]
                        var checkDisable=false
                        if(generated){

                            if(reqvsgenDataSun[i]==0 && reqvsgenDataMon[i]==0 && reqvsgenDataTue[i]==0 && reqvsgenDataWed[i]==0 && reqvsgenDataThu[i]==0 && reqvsgenDataFri[i]==0 && reqvsgenDataSat[i]==0){
                                checkDisable=true
                            }else{
                                checkDisable=false
                            }
                            allData=[reqvsgenDataShiftTime[i].shift_start,reqvsgenDataShiftTime[i].shift_length,reqvsgenDataShiftTime[i].shift_name,reqvsgenDataSun[i],reqvsgenDataMon[i],reqvsgenDataTue[i],reqvsgenDataWed[i],reqvsgenDataThu[i],reqvsgenDataFri[i],reqvsgenDataSat[i]]
                        }else{

                            if(reqvsgenDataSun[i].Sun==0 && reqvsgenDataMon[i].Mon==0 && reqvsgenDataTue[i].Tue==0 && reqvsgenDataWed[i].Wed==0 && reqvsgenDataThu[i].Thu==0 && reqvsgenDataFri[i].Fri==0 && reqvsgenDataSat[i].Sat==0){
                                checkDisable=true
                            }else{
                                checkDisable=false
                            }
                            allData=[reqvsgenDataShiftTime[i].shift_start,reqvsgenDataShiftTime[i].shift_length,reqvsgenDataShiftTime[i].shift_name,reqvsgenDataSun[i].Sun,reqvsgenDataMon[i].Mon,reqvsgenDataTue[i].Tue,reqvsgenDataWed[i].Wed,reqvsgenDataThu[i].Thu,reqvsgenDataFri[i].Fri,reqvsgenDataSat[i].Sat]
                        }                      for(var j=0;j<allData.length;j++){
                            temp2=this.next()
                            const compData=def_worksheet.getCell(temp2+this.rowCount);
                            if(j==2){
                            const idCol = def_worksheet.getColumn(temp2);
                            idCol.width = 15;
                            }
                            tempValue=String(allData[j])
                            compData.value=tempValue
                            compData.alignment={ vertical: 'middle', horizontal: 'center' };
                            if(i==0){
                            compData.font = {bold: true};
                            compData.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'d1d1e0'}};
                            }
                            if(j==0){
                            compData.border = {left: {style:'thin'}};
                            }
                            if(i==0 && j==0){
                            compData.border = {left: {style:'thin'},top: {style:'thin'}};
                            }
                            if(i==0 && j!=0){
                            compData.border = {top: {style:'thin'}};
                            }
    
                            if( j==(allData.length+ - +1)){
                            compData.border = {right: {style:'thin'}};
                            }
    
                            if(i==0 &&  j==(allData.length+ - +1)){
                            compData.border = {top: {style:'thin'},right: {style:'thin'}};
                            }
                            if( i==(reqvsgenDefDataShiftTime.length+ - +1)){
                            compData.border = {bottom: {style:'thin'}};
                            }
                            if( i==(reqvsgenDefDataShiftTime.length+ - +1) &&  j==(allData.length+ - +1)){
                            compData.border = {right: {style:'thin'},bottom: {style:'thin'},};
                            }
    
                            if(i==(reqvsgenDefDataShiftTime.length+ - +1) && j==0){
                            compData.border = {left: {style:'thin'},bottom: {style:'thin'}};
                            }
                            if(checkDisable==true ){
                            compData.font={color: {argb: "696969"}};
                            }
                        }
                    }
    
            // Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data: any) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob,  fileName);
            });
    
    }
}