import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-business-rules-pdf',
  templateUrl: './business-rules-pdf.page.html',
  styleUrls: ['./business-rules-pdf.page.scss'],
})
export class BusinessRulesPdfPage implements OnInit {
  pdfSrc = "../assets/document/FAA Order 7210_2_6_7_BasicWatchSchedule.pdf ";
  constructor(public modalCtrl: ModalController,) { }

  ngOnInit() {
  }
  downloadPdf() {

    const pdfUrl = './assets/sample.pdf';
    const pdfName = 'your_pdf_file';
    // FileSaver.saveAs(pdfUrl, pdfName);
    // link.download=this.pdfSrc
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
