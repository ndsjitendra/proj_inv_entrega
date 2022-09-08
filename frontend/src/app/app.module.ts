import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RegisterModule } from './modules/register/regsiter.module';
import { LoginModule } from './modules/login/login.module';
import { File } from '@ionic-native/file/ngx';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { DetailService } from './shared/services/detail.service';


const options: Partial<IConfig> | (() => Partial<IConfig>) = { };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot(options),
    LoginModule,
    RegisterModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    SharedComponentsModule,
    NgxSpinnerModule,
  ],
  providers: [Camera, DetailService, File, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
