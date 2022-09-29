import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaymentTileComponent } from './payment-tile.component';

@NgModule({
  declarations: [PaymentTileComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [PaymentTileComponent]
})
export class PaymentTileModule { }