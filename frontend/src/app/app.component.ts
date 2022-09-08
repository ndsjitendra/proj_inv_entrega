import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Observer, fromEvent, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetailService } from './shared/services/detail.service';
import { Keyboard } from '@capacitor/keyboard';
// import { LocalDbService } from './services/local-db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  routerEventsSubscription: Subscription;
  spinnerMessage: string = "Cargando...";

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private platform: Platform,
    private spinnerService: NgxSpinnerService,
    private detail: DetailService,
    
    // Network Service checks with navigator variable
  ) { }

  async ngOnInit() {
    await this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    // await this.platform.ready();

    this.platform.ready().then(async () => {
      this.detail.setExistingConnection(false);
      this.detail.setExportJson(false);
    });
    // CHECK IOS IMPLEMENTATION LATER
    // await Keyboard.setScroll({ isDisabled: true });
    this.platform.backButton.subscribeWithPriority(1, () => { // to disable hardware back button on whole app
    });
    this.createOnline$().subscribe((isOnline) => {
      if (!isOnline) {
        this.spinnerMessage = "Sin Conexión";
        this.spinnerService.show();
      } else {
        this.spinnerService.hide();
        this.spinnerMessage = "Cargando...";
      }
    });

  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

}
