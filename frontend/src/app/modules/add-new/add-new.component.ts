import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import * as date_fns from 'date-fns';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { Compresor as ConstantCompresor } from '../../shared/Constants/compresorConstants';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Record } from 'src/app/shared/models/record.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Alert } from 'src/app/shared/models/alert.model';
import { LocalStorageService } from 'src/app/shared/services/localStorage.service';
import { AddNewStateService } from './services/add-new-state.service';
import { StepState } from 'src/app/shared/interfaces/step';
import { AddNewValidator } from './add-new-validator';
import { trigger, style, animate, transition } from '@angular/animations';
import { Distributor } from 'src/app/shared/models/distributor.model';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.25s ease-out',
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('0.25s ease-in',
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AddNewComponent implements OnInit, OnDestroy {

  dataInitialized: boolean = false;
  checkHelp: boolean = false;
  newDate: Date;
  maxDate: Date;
  step: number = 1;
  compresores: Compresor[];
  distributors: Distributor[];
  compresorConstants = ConstantCompresor;

  validationIssues: boolean = false;
  serialAlreadyExists: boolean = false;
  internetIssues: boolean = false;

  title: string = 'Escanear QR'
  scannedQR: boolean = false;
  needQRScanner: boolean = false;
  noCompressorFound: boolean = false;
  validRange: boolean = false;
  scanValue: any;


  model: Record;
  stepState: StepState;
  disableBackButton: boolean = false;

  private addNewValidator: any;

  get user(): UserModel {
    return this.userService.user;
  }

  get stepState$() {
    return this.addNewStateService.stepState$;
  }

  get addNewForm$(): FormGroup {
    return this.addNewStateService.recordForm;
  }

  constructor(
    private serverService: ServerService,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    protected localStorageService: LocalStorageService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private addNewStateService: AddNewStateService,
  ) {
    this.addNewValidator = new AddNewValidator(serverService);
  }


  async ngOnInit() {
    this.dataInitialized = false;
    await this.getCompressors();
    await this.getDistributors();
    this.addNewStateService.startNewRecord();
    this.model = this.addNewStateService.recordModel;
    this.addNewStateService.stepState$.subscribe((s) => {
      this.stepState = s;
    });

    this.addNewStateService.turnOnRecordInProgress();
    this.dataInitialized = true;
  }

  ngOnDestroy(): void {
    // BarcodeScanner.stopScan();
  }

  async getCompressors() {
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
      console.log("ERROR ON COMPRESOR LOAD")
      this.noConnection();
    }
    this.compresores = JSON.parse(this.localStorageService.get('compresores'));
    this.addNewStateService.setCompresores(this.compresores);
  }

  async getDistributors() {
    try {
      const userSyncStatus = await this.serverService.checkUserSyncStatus(this.user.id);
      if (userSyncStatus.userSync === 1 || !this.localStorageService.get('distributors')) {
        this.spinnerService.show();
        this.localStorageService.remove('distributors');
        const distributors = await this.serverService.getAllDistributors();
        this.localStorageService.set('distributors', JSON.stringify(distributors));
        this.spinnerService.hide();
      }
    } catch (err) {
      console.log("ERROR ON DISTRIBUTOR LOAD")
      this.noConnection();
    }
    this.distributors = JSON.parse(this.localStorageService.get('distributors'));
  }

  async moveToStep(step?: number, direction?: string) {
    this.validationIssues = false;
    if (!step) {
      step = -1;
    }
    this.addNewStateService.saveState();
    if (direction === 'previous') {
      if (this.stepState.stepIndex === 0) {
        await this.showRecordAlert();
        return;
      }
      if (this.stepState.stepIndex < this.stepState.allSteps.length && this.stepState.stepIndex > 0) {
        this.stepState.currentStep = this.stepState.allSteps[--this.stepState.stepIndex];
        this.addNewStateService.updateStepState(this.stepState);
        return;
      }
    }
    if (this.stepState.currentStep.Key === 'R_S_7') {
      this.navCtrl.navigateBack('hub');
      return;
    }
    const feedback = await this.validateRecordModel();
    if (feedback !== 'Valid') {
      this.validationIssues = true;
      this.invalidForm(feedback);
    } else {
      if (this.stepState.stepIndex < this.stepState.allSteps.length - 1) {
        // Special Individual Steps Check
        if (this.stepState.currentStep.Key === 'R_S_5') {
          // Alerta especial por continuar
          const resp = await this.continueChecklistAlert();
          if (!resp) {
            return;
          } else {
            this.disableBackButton = true;
          }
        }
        if (this.stepState.currentStep.Key === 'R_S_6') {
          // Alerta especial por continuar
          const resp = await this.submitChecklistAlert();
          if (!resp) {
            return;
          } else {
            this.submit();
            this.addNewStateService.turnOffRecordInProgress();
          }
        }
        this.stepState.currentStep = this.stepState.allSteps[++this.stepState.stepIndex];
      }
    }
  }

  async ionViewWillLeave() {
    BarcodeScanner.stopScan();
  }

  /*
  *
  * Model Validation
  */
  async validateRecordModel() {
    return await this.addNewValidator.processValidater(this.stepState.currentStep, this.addNewStateService.recordForm, this.compresores, this.addNewStateService.compresor);
  }

  async submit() {
    this.spinnerService.show();
    let date: Date = new Date();
    let localId = this.user.matricula +''+ date.getTime();

    const record: Record = {
      localId:localId,
      username: this.user.username,
      nombreTecnico: this.user.nombre,
      matricula: this.user.matricula,
      modelo: this.addNewForm$.value.modelo,
      serie: this.addNewForm$.value.serie,
      aplicacion: this.addNewForm$.value.aplicacion,
      correoCliente: this.addNewForm$.value.correoCliente,
      estadoCliente: this.addNewForm$.value.estadoCliente,
      distribuidor: this.addNewForm$.value.distribuidor,
      sucursal: this.addNewForm$.value.sucursal,
      vendedor: this.addNewForm$.value.vendedor,
      factura: this.addNewForm$.value.factura,
      fechaCompra: this.addNewForm$.value.fechaCompra,
      modeloCompresorReemplazarCliente: this.addNewForm$.value.modeloCompresorReemplazarCliente,
      modeloCompresorCliente: this.addNewForm$.value.modeloCompresorCliente,
      maquinaCliente: this.addNewForm$.value.maquinaCliente,
      checklistComplete: this.addNewForm$.value.checklistComplete,
      tipoGarantia: this.addNewForm$.value.tipoGarantia,
      nombreCliente: this.addNewForm$.value.nombreCliente,
      telefonoCliente: this.addNewForm$.value.telefonoCliente,
      presionEvaporacion: this.addNewForm$.value.presionEvaporacion,
      temperaturaEvaporacion: this.addNewForm$.value.temperaturaEvaporacion,
      presionCondensacion: this.addNewForm$.value.presionCondensacion,
      temperaturaCondensacion: this.addNewForm$.value.temperaturaCondensacion,
      contactorCapacitor: this.addNewForm$.value.contactorCapacitor,
      superiorCapacitor: this.addNewForm$.value.superiorCapacitor,
      compresorSoldado: this.addNewForm$.value.compresorSoldado,
      instalacion: this.addNewForm$.value.instalacion,
      temperaturaFinal: this.addNewForm$.value.temperaturaFinal
    }
    await this.serverService.registrarGarantia(record);
    this.spinnerService.hide();
  }

  // Si se quiere visualizar la garantia a futuro
  // goToWarranty() {
  //   const record: Record = {
  //     username: this.user.username,
  //     nombreTecnico: this.user.nombre,
  //     aplicacion: this.addNewForm.value.aplicacion,
  //     matricula: this.user.matricula,
  //     compresorModel: this.addNewForm.value.modelo,
  //     compresorSerial: this.addNewForm.value.serie,
  //     correoCliente: this.addNewForm.value.correoCliente,
  //     distribuidor: this.addNewForm.value.distribuidor,
  //     factura: this.addNewForm.value.factura,
  //     fechaCompra: this.addNewForm.value.fechaCompra,
  //     marca: this.addNewForm.value.marca,
  //     modeloInstalado: this.addNewForm.value.modeloInstalado,
  //     nombreCliente: this.addNewForm.value.nombreCliente,
  //     telefonoCliente: this.addNewForm.value.telefonoCliente,
  //     placa: this.addNewForm.value.placa ? this.addNewForm.value.placa : '',
  //     presionEvaporacion: this.addNewForm.value.presionEvaporacion,
  //     temperaturaEvaporacion: this.addNewForm.value.temperaturaEvaporacion,
  //     presionCondensacion: this.addNewForm.value.presionCondensacion,
  //     temperaturaCondensacion: this.addNewForm.value.temperaturaCondensacion,
  //     temperaturaFinal: this.addNewForm.value.temperaturaFinal
  //   }
  //   this.addNewStateService.setRecordModel(record);
  //   this.addNewStateService.turnOffRecordInProgress();
  //   this.navCtrl.navigateForward('home/home/add-new/warranty');
  // }

  seeQrHelp() {
    this.title = 'Localizar Compresor'
    this.checkHelp = true;
  }

  returnEvent() {
    this.checkHelp = false;
  }

  async invalidForm(feedback: string) {
    let alertValues = new Alert();
    alertValues.header = 'Error';
    if (feedback === 'Invalid') {
      alertValues.message = 'Existen errores dentro del formulario!'
    } else {
      alertValues.message = feedback;
    }
    await this.alertService.showAlert(alertValues);
    return;
  }

  async noConnection() {
    let alertValues = new Alert();
    alertValues.header = 'Error';
    alertValues.message = 'Error en la conexión con el servidor.'
    const resp = await this.alertService.showAlert(alertValues);
    if (resp) {
      this.navCtrl.back();
    }
  }

  async submitChecklistAlert() {
    const alertValues = new Alert();
    alertValues.header = 'Desea finalizar el registro?';
    alertValues.message = 'Ya no podrá editar estos valores.';
    alertValues.twoButtons = true;
    const response = await this.alertService.showAlert(alertValues);
    if (response === 'si') {
      return true
    } else {
      return false;
    }
  }

  async continueChecklistAlert() {
    const alertValues = new Alert();
    alertValues.header = 'Desea continuar?';
    alertValues.message = 'Ya no podrá regresar a los pasos anteriores.';
    alertValues.twoButtons = true;
    const response = await this.alertService.showAlert(alertValues);
    if (response === 'si') {
      return true
    } else {
      return false;
    }
  }

  async showRecordAlert() {
    if (this.stepState.currentStep.Key === 'R_S_7') {
      this.navCtrl.navigateBack('hub');
      return;
    }
    const alertValues = new Alert();
    alertValues.header = 'Desea salir?';
    alertValues.message = 'Perderá el progreso en su registro.';
    alertValues.twoButtons = true;
    const response = await this.alertService.showAlert(alertValues);
    if (response === 'si') {
      this.addNewStateService.turnOffRecordInProgress();
      this.navCtrl.navigateBack('hub');
    } else {
      return;
    }
  }
}
