import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HubComponent } from './hub.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SwiperModule } from 'swiper/angular';
import { RecordListTileModule } from 'src/app/shared/dashboard-tiles/record-list-tile/record-list-tile.module';
import { UserTileModule } from 'src/app/shared/dashboard-tiles/user-tile/user-tile.module';
import { RegisterTileModule } from 'src/app/shared/dashboard-tiles/register-tile/register-tile.module';
import { StatsTileModule } from 'src/app/shared/dashboard-tiles/stats-tile/stats-tile.module';
import { PaymentTileModule } from 'src/app/shared/dashboard-tiles/payment-tile/payment-tile.module';
import { HelpTileModule } from 'src/app/shared/dashboard-tiles/help-tile/help-tile.module';


const routes: Routes = [
  {
    path: '',
    component: HubComponent
  }
];

@NgModule({
  declarations: [HubComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild(routes),
    SharedComponentsModule,
    RecordListTileModule,
    UserTileModule,
    RegisterTileModule,
    StatsTileModule,
    PaymentTileModule,
    HelpTileModule,
    SwiperModule
  ],
  providers: []
})
export class HubModule { }
