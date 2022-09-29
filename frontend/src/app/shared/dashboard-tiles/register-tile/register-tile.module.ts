import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RegisterTileComponent } from './register-tile.component';

@NgModule({
  declarations: [RegisterTileComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [RegisterTileComponent]
})
export class RegisterTileModule { }