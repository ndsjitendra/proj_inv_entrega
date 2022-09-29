import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/shared/Constants/Constants';
import { Alert } from 'src/app/shared/models/alert.model';
import { Record } from 'src/app/shared/models/record.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { RecordStateSevice } from 'src/app/shared/services/record-state.service';
import { RecordServerSevice } from 'src/app/shared/services/server-connection/record-server.service';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {

  dataInitialized: boolean = false;
  record: Record = null;
  dateFormat: string = Constants.DateFormat;
  status: string = '';

  get user() {
    return this.userService.user;
  }

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private spinnerService: NgxSpinnerService,
    private serverService: ServerService,
    private recordService: RecordStateSevice,
    private recordServerService: RecordServerSevice,
    private alertsService: AlertService,
    private toastController: ToastController
  ) {

  }

  async ngOnInit() {
    this.dataInitialized = false;
    this.spinnerService.show();
    if (this.recordService.get()) {
      this.record = this.recordService.get();
      if (this.record.status === 'PENDING') {
        this.status = 'CONDICIONADA';
      } else {
        this.status = this.record.status;
      }
    }
    this.dataInitialized = true;
    this.spinnerService.hide();

  }

  async getRecordPDF() {
    const resp = await this.serverService.getRecordPDF(this.user.username, this.record.localId);
    if (resp.succ) {
      window.open(resp.succ);
    }
  }

  async reportIssue() {
    const alertValues = new Alert();
    alertValues.header = 'Alerta!';
    alertValues.message = 'Desea levantar un reclamo para este registro?';
    alertValues.twoButtons = true;
    const resp = await this.alertsService.showAlert(alertValues);
    if (resp === 'si') {
      const petitionObject = {
        status: 'EN RECLAMO',
        recordLocalId: this.record.localId
      };
      this.recordServerService.updateRecordStatus(petitionObject);
      this.presentToast();
      this.navCtrl.navigateBack('hub');
    }

  }

  ionViewWillLeave() {
    this.recordService.clear();
  }

  exit() {
    this.navCtrl.navigateBack('records');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Se ha levantado el reclamo.',
      position: 'top',
      color:'success',
      duration: 2000
    });
    toast.present();
  }

}
