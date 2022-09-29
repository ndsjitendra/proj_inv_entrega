import { Component, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { Constants } from '../../Constants/Constants';
import { Payment } from '../../models/payment.model';

@Component({
  selector: "app-payments-tile",
  templateUrl: "./payment-tile.component.html",
  styleUrls: [ "./payment-tile.component.scss" ],
})
export class PaymentTileComponent implements OnChanges {
  @Output() goToPaymentClicked = new EventEmitter();
  @Input() isLoading: boolean;
  @Input() paymentInformation = [];
  @Input() compareDateLesserThan: Date;

  totalAmountOwned = 0;
  totalAmountPayed = 0;
  dateFormat: string = Constants.DateFormat;


  ngOnChanges() {
    this.reviewPaymentData();
   }

  goToPayments() {
    this.goToPaymentClicked.emit();
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
}
