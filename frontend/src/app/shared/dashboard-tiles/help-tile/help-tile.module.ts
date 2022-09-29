import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HelpTileComponent } from './help-tile.component';

@NgModule({
  declarations: [HelpTileComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [HelpTileComponent]
})
export class HelpTileModule { }