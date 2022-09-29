import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { NavBarComponent } from './navbar/navbar.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    NavBarComponent,
    AlertComponent

  ],
  exports: [
    NavBarComponent,
    AlertComponent
  ],
  providers: [
  ]

})
export class SharedComponentsModule { }
