import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserTileComponent } from './user-tile.component';

@NgModule({
  declarations: [UserTileComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [UserTileComponent]
})
export class UserTileModule { }