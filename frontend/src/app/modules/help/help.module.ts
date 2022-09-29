import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpComponent } from './help.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FilterCompressorComponent } from './filter-compressor/filter-compressor.component';
import { CompressorViewModalModule } from 'src/app/shared/modals/compressor-view-modal/compressor-view-modal.module';

const routes: Routes = [
  {
    path: '',
    component: HelpComponent
  },
  {
    path: 'filter-compressor',
    component: FilterCompressorComponent
  }
];

@NgModule({
  declarations: [HelpComponent, FilterCompressorComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CompressorViewModalModule,
    SharedComponentsModule
  ],
  providers: []
})
export class HelpModule { }
