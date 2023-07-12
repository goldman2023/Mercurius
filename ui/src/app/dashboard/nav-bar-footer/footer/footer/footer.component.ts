import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import straightlines_io_apis from 'src/app/json/apis.json';
import { HeaderTitleService } from '../../header-title.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  user_data
  user_data_name
  initials
  fname
  lname
  username
  checkuser=false
  user: any;
  title
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.user_data=JSON.parse(sessionStorage.getItem('userData'))
    if(this.user_data.empid==undefined){
      this.checkuser=false
      this.user=this.capitalizeFirstLetter(this.user_data.lname)
      this.username=this.user_data.username
    }else{
      this.checkuser=true
      this.fname=this.user_data.fname
      this.lname=this.user_data.lname
      // this.initials=this.user_data.initials
      if (this.user_data?.initials) {
        this.initials = this.user_data?.initials
      }
      else{
        this.initials = this.user_data?.fname[0] + this.user_data?.lname[0];
      }
      this.user=this.capitalizeFirstLetter(this.lname)+' ('+this.initials+')'
      this.username=this.user_data.username
    }
    this.headerTitleService.title.subscribe(title => {
      this.title = title;
    });

  }
  checkhomebuttonCss(){
    if(this.title=="Welcome!"){
      if(this.checklogutClickedOrNot==true){
        return ' '
      }else{
        return 'app-font-mercurius-secondary-color '
      }
    }else{

      if(this.user_data.role=='bidmanager'){
        return ''
      }else{
        if(this.title=='My Bidding'){
          if(this.checklogutClickedOrNot==true){
            return ' '
          }else{
            return 'app-font-mercurius-secondary-color '
          }
        }else{
          return ''
        }
      }

    }
  }
  checkhomeLabelCss(){
    if(this.title=="Welcome!"){
      if(this.checklogutClickedOrNot==true){
        return ' data'
      }else{
        return 'app-font-mercurius-secondary-color data'
      }
    }else{
      if(this.user_data.role=='bidmanager'){
        return 'data'
      }else{
        if(this.title=='My Bidding'){
          if(this.checklogutClickedOrNot==true){
            return ' data'
          }else{
            return 'app-font-mercurius-secondary-color data'
          }
        }else{
          return 'data'
        }
      }
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  checklogutClickedOrNot=false
  async logOut(){
    // sessionStorage.removeItem('token')
this.checklogutClickedOrNot=true
    // this.navCtrl.navigateBack('new-login')
    const confirm = await this.alertCtrl.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out of the application?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.checklogutClickedOrNot=false

          }
        },
        {
          text: 'YES',

          role: 'ok',
          handler: () => {
            sessionStorage.clear()
            this.navCtrl.navigateBack(straightlines_io_apis.apis.login_api)
            this.checklogutClickedOrNot=true


          }}]})

    await confirm.present();
  }
  logoutlabelbutton(){
    if(this.checklogutClickedOrNot==true){
      return 'app-font-mercurius-secondary-color data'
    }
    return 'data'
  }
  logoutbutton(){
    if(this.checklogutClickedOrNot==true){
      return 'app-font-mercurius-secondary-color '
    }
    return ''
  }
  userData(){
    if(this.user_data.role=='bidmanager'){
      this.headerTitleService.setTitle('');
      this.navCtrl.navigateForward([straightlines_io_apis.apis.user])
    }else{
      this.headerTitleService.setTitle('');
      this.navCtrl.navigateForward([straightlines_io_apis.apis.employee_user])
    }

  }
  home(){
    if(this.user_data.role=='bidmanager'){
      if(this.user_data.role=='guest'){
        this.navCtrl.navigateBack([straightlines_io_apis.apis.guest_dashboard]);
      }else{
        this.navCtrl.navigateBack([straightlines_io_apis.apis.dashboard])
      }
    }else{
      this.navCtrl.navigateBack([straightlines_io_apis.apis.employee_home])
    }

  }
}
