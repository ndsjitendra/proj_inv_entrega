import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskModule } from 'ngx-mask';
import { RecordsComponent } from './records.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { RecordComponent } from './record/record.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsComponent
  },
  {
    path: 'record',
    component: RecordComponent
  }
];

@NgModule({
  declarations: [
    RecordsComponent,
    RecordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
  ],
  providers: []
})
export class RecordsModule { }
