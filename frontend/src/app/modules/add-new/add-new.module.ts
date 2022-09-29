import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { AddNewComponent } from './add-new.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatNativeDateModule } from '@angular/material/core';
import { InputCompressorComponent } from './steps/step-1/input-for-compressor.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { CompressorInformationComponent } from './steps/step-2/compressor-information.component';
import { InvoiceInformationComponent } from './steps/step-3/invoice-information.component';
import { ClientInformationComponent } from './steps/step-4/client-information.component';
import { ChecklistComponent } from './steps/step-5/checklist.component';
import { RangeCheckComponent } from './steps/step-6/range-check.component';
import { WarrantyCheckComponent } from './steps/step-7/warranty-check.component';


const routes: Routes = [
  {
    path: '',
    component: AddNewComponent
  },
  {
    path: 'warranty',
    component: WarrantyComponent
  }
];

@NgModule({
  declarations: [
    AddNewComponent,
    InputCompressorComponent,
    CompressorInformationComponent,
    InvoiceInformationComponent,
    ClientInformationComponent,
    ChecklistComponent,
    RangeCheckComponent,
    WarrantyCheckComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild(routes),
    SharedComponentsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: []
})
export class AddNewModule { }
