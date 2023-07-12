import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuard implements CanActivate {
  constructor(private authSer:LoginService,private router:Router){}
  canActivate(): boolean  {
      if(this.authSer.loginValidationForGuest()){

        return true
      }else{
        this.router.navigateByUrl('/login')
        return false
      }
  }

}
