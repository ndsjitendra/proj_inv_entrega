import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Alert } from 'src/app/shared/models/alert.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  get user() {
    return this.userService.user;
  }

  title: string = "";

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.title = this.user.nombre + " " + this.user.apellido;
  }

  changePersonalInfo() {

  }

  async doLogout() {
    const alertValues = new Alert();
    alertValues.header = '¿Deseas salir?';
    alertValues.message = '¿Estás seguro de que quieres salir de tu cuenta?';
    alertValues.twoButtons = true;
    const response = await this.alertService.showAlert(alertValues);
    if (response === 'si') {
      this.userService.logout();
      this.navCtrl.navigateBack('login');
    } else {
      return;
    }
  }

  exit() {
    this.navCtrl.navigateBack('hub');
  }

}
