import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ToastMessage } from 'src/app/shared/interfaces/toast';
import { CompressorViewModalComponent } from 'src/app/shared/modals/compressor-view-modal/compressor-view-modal.component';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Compresor as ConstantCompresor } from '../../../shared/Constants/compresorConstants';

@Component({
  selector: 'app-filter-compressor',
  templateUrl: './filter-compressor.component.html',
  styleUrls: ['./filter-compressor.component.scss'],
})
export class FilterCompressorComponent implements OnInit, OnDestroy {

  filterForm: FormGroup;
  formChangesSubscription: Subscription = null;
  compresorConstants = ConstantCompresor;
  originalCompressors: Compresor[] = [];
  compressorsToFilter: Compresor[] = [];
  checkResults: boolean = false;

  get user(): UserModel {
    return this.userService.user
  }

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private serverService: ServerService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.initializeForm();
    try {
      const userSyncStatus = await this.serverService.checkUserSyncStatus(this.user.id);
      if (userSyncStatus.userSync === 1 || !this.localStorageService.get('compresores')) {
        this.spinnerService.show();
        this.localStorageService.remove('compresores');
        const compresores = await this.serverService.getAllCompresors();
        this.localStorageService.set('compresores', JSON.stringify(compresores));
        await this.serverService.turnOffUserSyncStatus(this.user.id);
        this.spinnerService.hide();

      }
    } catch (err) {
      this.noConnection();
    }
    this.originalCompressors = JSON.parse(this.localStorageService.get('compresores'));
    this.formChangesSubscription = this.filterForm.valueChanges.subscribe((val) => {
      this.changeField();
    })
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = null;
    }
  }

  initializeForm() {
    this.filterForm = this.formBuilder.group({
      hp: [null],
      aplicacion: [null],
      fases: [null],
      refrigerante: [null],
      conexion: [null],
      voltaje: [null],
      btu: [null],
    })
  }

  viewResults() {
    if (!this.filterForm.value.hp && !this.filterForm.value.aplicacion && !this.filterForm.value.fases && !this.filterForm.value.refrigerante && !this.filterForm.value.conexion && !this.filterForm.value.voltaje && !this.filterForm.value.btu) {
      const toast: ToastMessage = {
        message: 'No ingreso ningún filtro',
        position: 'bottom',
        color: 'danger',
        duration: 2000
      };
      this.toastService.presentToast(toast);
      return;
    }
    this.checkResults = true;
  }

  returnToFilter() {
    this.checkResults = false;
  }

  async viewCompressor(compressor: Compresor) {
    const modal = await this.modalCtrl.create({
      component:CompressorViewModalComponent,
      cssClass: ['modal-compressor'],
      componentProps: {
        compressor: compressor
      },
      backdropDismiss:false
    });
    return modal.present(); 
  }

  changeField() {
    let originalCompressors = this.originalCompressors;
      
    if (this.filterForm.controls.hp.value) {
      originalCompressors = originalCompressors.filter(c => c.hp === this.filterForm.controls.hp.value);
    }
    if (this.filterForm.controls.aplicacion.value) {
      originalCompressors = originalCompressors.filter(c => c.aplicacion === this.filterForm.controls.aplicacion.value);
    }
    if (this.filterForm.controls.fases.value) {
      originalCompressors = originalCompressors.filter(c => c.fases === this.filterForm.controls.fases.value);
    }
    if (this.filterForm.controls.refrigerante.value) {
      originalCompressors = originalCompressors.filter(c => c.refrigerante === this.filterForm.controls.refrigerante.value);
    }
    if (this.filterForm.controls.conexion.value) {
      originalCompressors = originalCompressors.filter(c => c.conexion === this.filterForm.controls.conexion.value);
    }
    if (this.filterForm.controls.voltaje.value) {
      originalCompressors = originalCompressors.filter(c => c.voltaje === this.filterForm.controls.voltaje.value);
    }
    if (this.filterForm.controls.btu.value) {
      originalCompressors = originalCompressors.filter(c => c.btu.includes(this.filterForm.controls.btu.value));
    }
    this.compressorsToFilter = originalCompressors;
  }
  
  exit() {
    this.navCtrl.back();
  }

  noConnection() {
    const toast: ToastMessage = {
      message: 'No hay conexión a internet',
      position: 'bottom',
      color: 'danger',
      duration: 2000
    };
    this.toastService.presentToast(toast);
    this.exit();
  }

  resetForm() {
    this.filterForm.reset();
  }


}
