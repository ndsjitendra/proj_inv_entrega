import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/shared/Constants/Constants';
import { Payment } from 'src/app/shared/models/payment.model';
import { PaymentService } from 'src/app/shared/services/server-connection/payment.service';
import * as date_fns from 'date-fns';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {


  dateFormat: string = Constants.DateFormat;
  totalAmountOwned: number = 0;
  totalAmountPayed: number = 0;
  paymentInformation: Payment[];
  filterData: any;

  get user() {
    return this.userService.user;
  }

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private paymentService: PaymentService
  ) { }


  async ngOnInit() {
    let date = new Date();
    const longTimeBack = new Date('1/1/2000');
    const today = date_fns.endOfDay(new Date());
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: longTimeBack,
      compareDateLesserThan: today
    };
    this.filterData = initialData;
    this.paymentInformation = (await this.paymentService.getPaymentInformation(initialData)).result;
    this.reviewPaymentData();
  }

  reviewPaymentData() {
    this.paymentInformation.forEach((payment: Payment) => {
      if (payment.status === 'PENDING') {
        if (payment.balance > 0) {
          if (payment.balance === payment.totalAmount) {
            this.totalAmountOwned = this.totalAmountOwned + payment.balance;
          } else {
            this.totalAmountOwned = this.totalAmountOwned + payment.balance;
          }
        }
      } else {
        if (payment.balance === 0) {
          this.totalAmountPayed = this.totalAmountPayed + payment.totalAmount;
        } else {
          const amountPayed = payment.totalAmount - payment.balance;
          this.totalAmountPayed = this.totalAmountPayed + amountPayed;
        }
      }
    });
  }

  exit() {
    this.navCtrl.navigateBack('hub');
  }
}
