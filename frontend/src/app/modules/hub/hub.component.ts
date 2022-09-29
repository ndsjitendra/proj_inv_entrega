import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasePageComponentDirective } from 'src/app/shared/base-pages/base-page.component';
import { Record } from 'src/app/shared/models/record.model';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { RecordServerSevice } from 'src/app/shared/services/server-connection/record-server.service';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
// import { LocalDbService } from 'src/app/services/local-db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { trigger, style, animate, transition } from '@angular/animations';
import SwiperCore,  { Navigation, Pagination, Scrollbar, A11y, SwiperOptions, Swiper } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import * as date_fns from 'date-fns';
import { RecordStateSevice } from 'src/app/shared/services/record-state.service';
import { StatsService } from 'src/app/shared/services/server-connection/stats.service';
import { PaymentService } from 'src/app/shared/services/server-connection/payment.service';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out', 
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: 300, opacity: 1 }),
            animate('0.5s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HubComponent implements OnInit, AfterContentChecked {
  
  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 25,
    effect:'cards',
    navigation: true,
    pagination: { clickable: false },
    slideToClickedSlide: true,
    initialSlide: 2,
    centeredSlides: true,
    longSwipes: false,
    shortSwipes: false,

  };

  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  dataInitialized: boolean = false;
  recordList: Record[] = [];
  recordStats = [];
  paymentInformation = [];
  firstDate: Date;
  lastDate: Date;
  currentDate: Date;
  longTimeBack: Date;


  get user() {
    return this.userService.user;
  }

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private recordServerService: RecordServerSevice,
    private recordStateService: RecordStateSevice,
    private statsService: StatsService,
    private paymentService: PaymentService,
    // Base Page Services
    protected serverService: ServerService,
    protected userService: UserService,
    protected localStorageService: LocalStorageService,
    protected spinnerService: NgxSpinnerService,
    private cdRef: ChangeDetectorRef
  ) {
  }


  ngOnInit() { }

  async ionViewWillEnter() {
    this.spinnerService.show();
    this.dataInitialized = false;
    await this.initializeDataFromServer();
    this.dataInitialized = true;
    this.spinnerService.hide();
  }

  async initializeDataFromServer() {
    if (!this.localStorageService.get('user') || !this.localStorageService.get('userToken')) {
      this.spinnerService.show();
      await this.serverService.getUser();
      this.spinnerService.hide();
    } else {
      const user = JSON.parse(this.localStorageService.get('user'));
      this.userService.setUser(user)
    }
    this.recordList = (await this.recordServerService.getRecordTileInformation({ username: this.user.username })).result;
    let date = new Date();
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.currentDate = new Date();
    this.lastDate = date_fns.endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: this.firstDate,
      compareDateLesserThan: this.lastDate
    };
    this.longTimeBack = new Date('1/1/2000');
    const initialDataPayment = {
      username: this.user.username,
      compareDateBiggerThan: this.longTimeBack,
      compareDateLesserThan: date
    };
    this.recordStats = (await this.statsService.getFilteredStats(initialData)).result;
    this.paymentInformation = (await this.paymentService.getPaymentInformation(initialDataPayment)).result;
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }

  goToAddNew() {
    this.navCtrl.navigateForward('add-new');
  }

  goToRecords() {
    this.navCtrl.navigateForward('records');
  }

  goToUserPage() {
    this.navCtrl.navigateForward('user');
  }

  goToStats() {
    this.navCtrl.navigateForward('stats');
  }

  goToPayments() {
    this.navCtrl.navigateForward('payments');
  }

  goToHelp() {
    this.navCtrl.navigateForward('help');
  }

  async goToRecord(event) {
    const record = (await this.recordServerService.getRecordInformation({ localId: event.localId })).succ;
    this.recordStateService.set(record);
    this.navCtrl.navigateForward('records/record');
  }

  onSwiper() {
  }

  onSlideChange() {
  }

  moveToSlide(data) {
    if (data.isPrev) {
      this.swiper.swiperRef.slidePrev(100);
    } else if(data.isNext){
      this.swiper.swiperRef.slideNext(100);
    }
  }
    

}
