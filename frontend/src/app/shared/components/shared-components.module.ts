import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { IonicModule } from '@ionic/angular';
import { BottomButtonsComponent } from './bottom-buttons/bottom-buttons.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { InputFieldComponent } from './generic/input/input-field.component';
import { SelectFieldComponent } from './generic/select/select-field.component';
import { HeaderComponent } from './header/header.component';
import { QrHelpComponent } from './qr-help/qr-help.component';
import { RecordCardComponent } from './record-card/record-card.component';
import { UserCardComponent } from './user-card/user-card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateFieldComponent } from './generic/datepicker/date-field.component';
import { CameraFieldComponent } from './generic/camera-field/camera-field.component';
import { NgxMaskModule } from 'ngx-mask';
import { PhoneFieldComponent } from './generic/phone/phone-field.component';
import { EmailFieldComponent } from './generic/email-field/email-field.component';
import { CheckboxFieldComponent } from './generic/checkbox-field/checkbox-field.component';
import { MatNativeDateModule } from '@angular/material/core';
import { DatepickerViewsSelection } from './datepicker-views-selection/datepicker-views-selection.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RadioFieldComponent } from './generic/radio-field/radio-field.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgSelectModule,
    NgxMaskModule
  ],
  declarations: [
    UserCardComponent,
    HeaderComponent,
    DatepickerComponent,
    QrHelpComponent,
    RecordCardComponent,
    InputFieldComponent,
    SelectFieldComponent,
    BottomButtonsComponent,
    DateFieldComponent,
    CameraFieldComponent,
    PhoneFieldComponent,
    EmailFieldComponent,
    CheckboxFieldComponent,
    DatepickerViewsSelection,
    RadioFieldComponent,
  ],
  exports: [
    UserCardComponent,
    HeaderComponent,
    DatepickerComponent,
    QrHelpComponent,
    RecordCardComponent,
    InputFieldComponent,
    SelectFieldComponent,
    BottomButtonsComponent,
    DateFieldComponent,
    CameraFieldComponent,
    PhoneFieldComponent,
    EmailFieldComponent,
    CheckboxFieldComponent,
    DatepickerViewsSelection,
    RadioFieldComponent,
  ],
  providers: [
    MatDatepickerModule,
  ]

})
export class SharedComponentsModule { }
