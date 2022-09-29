import { Injectable, Input } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})

export class AlertService {


  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }


  async showAlert(alertValues: Alert) {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        cssClass: '',
        header: alertValues.header,
        subHeader: alertValues.subHeader ? alertValues.subHeader : '',
        message: alertValues.message ? alertValues.message : '',
        buttons: alertValues.twoButtons ?
          [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                resolve('no');
              }
            }, {
              text: 'Si',
              cssClass: 'primary',
              handler: () => {
                resolve('si');
              }
            }
          ] :
          [
            {
              text: 'Ok',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                resolve('no');
              }
            }
          ]
      });
      alert.present();
    })


  }


}
