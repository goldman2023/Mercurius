import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {
  private data: Record<string, any> = {};
  private userId: number | null = null;
  constructor() {
    this.init();
  }
  private init(){
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.userId = parsedUserData.id;
    }

    const data = localStorage.getItem('data');
    if (data) {
      this.data = JSON.parse(data);
    }
  }
  getItem(key: string){
    this.init()
    if (!this.userId) {
      return JSON.stringify(this.data[key] ?? null);
    }

    const userData = this.data[this.userId];
    if (!userData || !(key in userData)) {
      return null;
    }

    return JSON.stringify(userData[key]);
  }
  setItem(key: string, value: string){
    this.init()
    let newData;
    if(this.userId){
      newData = { ...this.data?.[this.userId], [key]: JSON.parse(value) };
    }
    else{
      newData = { ...this.data, [key]: JSON.parse(value) };
    }
    this.overwrite(newData);
  }
  removeItem(key: string){
    this.init()
    let userData;
    if(this.userId){
      if(this.data?.[this.userId]?.[key]){
        userData = this.data[this.userId];
        delete userData?.[key];
        this.overwrite(userData);
      }
    }else{
      if(this.data?.[key]){
        delete this.data?.[key];
        this.overwrite(this.data);
      }
    }
  }
  private overwrite(newData: any){
    if(this.userId){
      this.data = { ...this.data, [this.userId]: newData };
      localStorage.setItem('data',JSON.stringify(this.data));
    }else{
      localStorage.setItem('data',JSON.stringify(newData));
    }
  }
}
