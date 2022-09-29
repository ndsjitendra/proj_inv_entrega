import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CompressorViewModalComponent } from './compressor-view-modal.component';

@NgModule({
  declarations: [CompressorViewModalComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CompressorViewModalComponent]
})
export class CompressorViewModalModule { }