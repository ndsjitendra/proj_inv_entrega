import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { StatsComponent } from './stats.component';
import { NgChartsModule } from 'ng2-charts';

const routes: Routes = [
  {
    path: '',
    component:  StatsComponent
  },
];

@NgModule({
  declarations: [
    StatsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    NgChartsModule
  ],
  providers: []
})
export class StatsModule { }
