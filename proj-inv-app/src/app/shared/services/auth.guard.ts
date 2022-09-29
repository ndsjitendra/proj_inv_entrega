import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponsePayload } from '../models/payload.model';
import { LocalStorageService } from './localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  userToken: ResponsePayload;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userToken = JSON.parse(this.localStorageService.get('userToken'));
    // use this class to determine whether user can access to the route.
    if (userToken && new Date(userToken.expiredAt) > new Date()) {
      return true;
    } else {
      this.localStorageService.clear();
      this.router.navigate(['login']);
      return false;
    }
  }
}
