
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import moment from 'moment';
import { PayPeriodService } from 'src/app/services/pay-period/pay-period.service';
import { CommonService } from '../../common.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sticky-note',
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss'],
})
export class StickyNoteComponent implements OnInit {
  @Input() clientY;
  @Input() clientX;
  @Input() noteEmpIdAndDate;
  @Input() stickyDetails;
  @Input() schedule;

  @Output() stickyNotes = new EventEmitter<boolean>();
  user_data;
  currentDate = new Date();
  noteForm = new FormGroup({
    notes: new FormControl(null, Validators.required),
    title: new FormControl(null,),
  });
  noteDetails = [];
  constructor(
    private payPeriodService: PayPeriodService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public dataService: CommonService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.user_data = JSON.parse(sessionStorage.getItem('userData'));
    this.getAllNotes()
  }
  getAllNotes(){
    this.payPeriodService.getAllEmployeeNotesByDateAndEmpId(this.noteEmpIdAndDate.empId,moment(this.noteEmpIdAndDate.date).format('YYYY-MM-DD')).subscribe(notes => {
      this.noteDetails = notes
      this.noteDetails = this.noteDetails.map(item => {
        return { ...item, colors: this.getRandomColor() };
      });
    })
  }

  closeSticky(value: boolean) {
    this.stickyNotes.emit(value);
  }
  sendStickyData(message) {
    this.schedule ? this.dataService.sendData(message) :  this.openSnackBar(message)
  }
  successMassage;
  lines;
  addNote() {
    this.successMassage = '';
    if(this.showNoteDetails){
      if(this.showNoteDetails.description != this.noteForm.value.notes || this.showNoteDetails.title != this.noteForm.value.title){
        const data = {
          id: this.showNoteDetails.id,
          description: this.noteForm.value.notes,
          title: this.noteForm.value.title,
          submittedForDate: this.showNoteDetails.submittedForDate,
          submittedby: this.showNoteDetails.submittedby,
          submitteddate: this.showNoteDetails.submitteddate,
          submittedfor: this.showNoteDetails.submittedfor,
        };
        this.payPeriodService.addNewEmployeeNotes(data).subscribe(
          async (res) => {
          },
          async (error) => {
            this.noteDetails = this.noteDetails.map(item => {
              if (item.id === this.showNoteDetails.id) {
                return { ...item, description: data.description , title: data.title };
              }
              return item;
            });
            this.successMassage = error.error.text;
          this.sendStickyData(this.successMassage)
          }
        );
      }
    }else{
      const data = {
          description: this.noteForm.value.notes,
          title: this.noteForm.value.title,
          submittedForDate: moment(this.noteEmpIdAndDate.date).format('YYYY-MM-DD'),
          submittedby: this.user_data.id,
          submittedfor: this.noteEmpIdAndDate.empId,
          submitteddate: moment(this.currentDate).format('YYYY-MM-DD'),
      };
      this.payPeriodService.addNewEmployeeNotes(data).subscribe(
        async (res) => {},
        async (error) => {
          this.successMassage = error.error.text;
        this.sendStickyData(this.successMassage)
        this.getAllNotes()
        }
      );
    }
   
  }

  reset(){
    if(this.noteDetails){
      this.noteForm.patchValue({
        notes: this.noteDetails
      })
    }else{
      this.noteForm.reset()
    }
  }

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  openSnackBar(data) {
    this.snackBar.open(data, 'Success', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3 * 1000,
    });

  }


  showNoteDetails
  isNoteShow = false
  showNote(note){
    this.showNoteDetails = note;
    this.isNoteShow = true;
    this.noteForm.patchValue({
      notes: note.description,
      title: note.title
    })
  }
  addNew(){
    this.showNoteDetails = null;
    this.isNoteShow = true;
    this.noteForm.patchValue({
      notes: this.showNoteDetails,
      title: null
    })
  }
  saveNote(){
    this.isNoteShow = false;
    this.noteForm.value.notes || this.noteForm.value.title ? this.addNote() : null;
  }


  private colors = ['#B1E7FC', '#FBF1CC', '#DEE8C1',  '#FFB4BF', '#FDB2B2', '#C5BCCE', '#ECC0AA'];
  private usedColors: string[] = [];

  getRandomColor(): string {
    if (this.usedColors.length === this.colors.length) {
      this.usedColors = [];
    }

    let randomColor;
    do {
      randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    } while (this.usedColors.includes(randomColor));

    this.usedColors.push(randomColor);
    return randomColor;
  }

  deleteNote(note){
    this.payPeriodService.deleteEmployeeNoteByNoteId(note.id).subscribe(
        async (res) => {},
        async (error) => {
          this.successMassage = error.error.text;
        this.sendStickyData(this.successMassage)
        this.getAllNotes()
        }
  );
  }

}
