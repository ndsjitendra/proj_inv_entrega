import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecordListTileComponent } from './record-list-tile.component';

@NgModule({
  declarations: [RecordListTileComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [RecordListTileComponent]
})
export class RecordListTileModule { }