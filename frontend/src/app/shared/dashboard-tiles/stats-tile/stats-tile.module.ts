import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StatsTileComponent } from './stats-tile.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [StatsTileComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgChartsModule
  ],
  exports: [StatsTileComponent]
})
export class StatsTileModule { }