import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HelpService } from 'src/app/shared/services/server-connection/help.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  get user() {
    return this.userService.user;
  }

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private helpService: HelpService
  ) { }

  ngOnInit() {
  }

  enterFilter() {
    this.navCtrl.navigateForward('help/filter-compressor');
  }

  async openHelpPDF(type: string) {
    let data = null;
    let response = null;
    switch (type) {
      case 'yf':
        data = {
          fileLocation: 'guide-pdf/YF-INSTRUCTIVO-ESPANOL.pdf'
        };
        break;
      case 'yh':
        data = {
          fileLocation: 'guide-pdf/YH-INSTRUCTIVO-ESPANOL.pdf'
        };
        break;
      case 'ym':
        data = {
          fileLocation: 'guide-pdf/YM-INSTRUCTIVO-ESPANOL.pdf'
        };
        break;
    }
    response = await this.helpService.getHelpPDF(data);
    window.open(response.succ);
  }

  exit() {
    this.navCtrl.navigateBack('hub');
  }

}
