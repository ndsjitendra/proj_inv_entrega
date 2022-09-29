import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Record } from 'src/app/shared/models/record.model';
import { RecordStateSevice } from 'src/app/shared/services/record-state.service';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
// import { LocalDbService } from 'src/app/services/local-db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
})
export class RecordsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  dataInitialized: boolean = false;
  records: Record[];

  offset: number = 0;
  totalCount: number = -1;

  get user() {
    return this.userService.user;
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private navCtrl: NavController,
    private spinnerService: NgxSpinnerService,
    private recordService: RecordStateSevice,
    private serverService: ServerService
    // private localDbService: LocalDbService
  ) {

  }

  async ionViewWillEnter() {
    if (this.records && this.records.length < 0) {
      this.dataInitialized = false;
      this.spinnerService.show();
      const response = await this.serverService.getRecordsForUser(this.user.username, this.offset);
      if (response.count > 0) {
        this.records = response.rows;
        this.totalCount = response.count;
      }
      this.dataInitialized = true;
      this.spinnerService.hide();
    }

  }

  async ngOnInit() {
    this.dataInitialized = false;
    this.spinnerService.show();
    try {
      const response = await this.serverService.getRecordsForUser(this.user.username, this.offset);
      if (response.count > 0) {
        this.records = response.result;
        this.totalCount = response.count;
      }
      this.dataInitialized = true;
      this.spinnerService.hide();
    } catch (err) {
      this.dataInitialized = false;
      this.spinnerService.hide();
    }
  }

  async loadNextRecords(event) {
    if (this.records.length !== this.totalCount) {
      this.offset = this.offset + 5;
      const response = await this.serverService.getRecordsForUser(this.user.username, this.offset);
      if (response.result.length > 0) {
        this.records.push(...response.result);
      } else {
        this.infiniteScroll.complete();
      }
      event.target.complete();
    } else {
      this.infiniteScroll.complete();
    }
  }

  async goToRecord(record: Record) {
    this.recordService.set(record);
    this.navCtrl.navigateForward('records/record');
  }

  async doRefresh(event) {
    this.offset = 0;
    try {
      this.dataInitialized = false;
      const response = await this.serverService.getRecordsForUser(this.user.username, this.offset);
      if (response.result.length > 0) {
        this.records = response.result;
        this.totalCount = response.count;
        if (this.records.length > 0) {
          event.target.complete();
        }
      } else {
        this.infiniteScroll.complete();
      }

      this.dataInitialized = true;
    } catch (err) {
      this.dataInitialized = false;
    }
  }

  exit() {
    this.navCtrl.navigateBack('hub');
  }

}
