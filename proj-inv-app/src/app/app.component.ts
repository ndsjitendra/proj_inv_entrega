import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponsePayload } from './shared/models/payload.model';
import { LocalStorageService } from './shared/services/localStorage.service';
import { OfflineService } from './shared/services/offline.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proj-inv-app';
  loggedIn: boolean;
  tab: string;

  public get isOnline(): any {
    return this.offlineService.isOnline;
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private offlineService: OfflineService,
    private spinnerService: NgxSpinnerService,
    private location: Location
  ) {
    this.offlineService.connectionChanged.subscribe((value) => {
      if (!this.offlineService.isOnline) {
        this.spinnerService.show();
      }
      if (this.offlineService.isOnline) {
        this.spinnerService.hide();
      }
    });

    this.userService.userLoggedIn.subscribe((value) => {
      this.loggedIn = value;
    });

    this.router.events.subscribe((val) => {
      if (location.path() !== '') {
        this.tab = location.path();
      } else {
        this.tab = 'home';
      }
    })
  }

  logout() {
    const result = window.confirm("¿Seguro que quieres salir?");
    if (result) {
      this.userService.logout();
      this.localStorageService.clear();
      this.router.navigateByUrl('login');
    } else {
      return;
    }
  }

  redirect(event) {
    switch (event) {
      case 'home':
        this.router.navigateByUrl('home')
        break;
      case 'upload':
        this.router.navigateByUrl('upload')
        break;
    }
  }
}
