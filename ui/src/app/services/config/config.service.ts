import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  configUrl
  public configurlJava = new BehaviorSubject('');
  public configurlPython = new BehaviorSubject('');
  constructor(private http: HttpClient) { }

  getConfigURLForPython() {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.configUrl='http://3.13.254.87:'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
      this.configUrl='http://3.13.254.87:'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this.configUrl='http://52.14.8.217:'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this.configUrl='http://3.140.109.198:'
    }else{
      this.configUrl='http://18.119.62.157:'
    }
    this.configurlPython.next(this.configUrl+'5000')
  }
  getConfigURLForJava() {
    if(location.hostname=='localhost'|| location.hostname=='127.0.0.1'){
      this.configUrl='http://3.13.254.87:'
    }else if(location.hostname=='dev.straightlines.io' || location.hostname=='3.13.254.87'){
      this.configUrl='http://3.13.254.87:'
    }else if(location.hostname=='test.straightlines.io' || location.hostname=='52.14.8.217'){
      this.configUrl='http://52.14.8.217:'
    }else if(location.hostname=='staging.straightlines.io' || location.hostname=='3.140.109.198'){
      this.configUrl='http://3.140.109.198:'
    }else{
      this.configUrl='http://18.119.62.157:'
    }
    this.configurlJava.next(this.configUrl+'2020')
  }
}
