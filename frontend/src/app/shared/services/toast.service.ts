import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastMessage } from '../interfaces/toast';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(
    private toastController: ToastController,
  ) { }

  async presentToast(toastMessage: ToastMessage) {
    const toast = await this.toastController.create(toastMessage);
    toast.present();
  }
}