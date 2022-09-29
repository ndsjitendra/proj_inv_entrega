import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { CompresorStateService } from 'src/app/shared/services/getItem/compresor-state.service';
import { ServerService } from 'src/app/shared/services/server.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-compresor',
  templateUrl: './compresor.component.html',
  styleUrls: ['./compresor.component.scss']
})
export class CompresorPageComponent implements OnInit {

  compresor: Compresor;
  dataInitialized: boolean = false;
  madeChanges: boolean = false;
  compresorForm: FormGroup;
  editCheck: boolean = false;
  validationIssues: boolean = false;


  submitCheck: boolean = false;

  newCompresor: boolean = false;

  showAlert: boolean = false;
  alertType: string;
  alertMessage: string;

  newCompresorCheck: boolean = false;

  constructor(
    private compresorStateService: CompresorStateService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dataInitialized = false;
    this.newCompresorCheck = false;
    this.editCheck = false;
    let testCompresor = {
      aplicacion: "REFRIGERACIÓN MEDIA TEMPERATURA",
      btu: "2.5",
      conexion: "SOLDABLE",
      createdAt: null,
      desc_prod: "INVERTER MED TEMP 220/1/60",
      fases: "1",
      hp: "-",
      id: 4,
      modelo: "YIM38E2G-100",
      refrigerante: "INV R404A",
      tipo: "COMPRESOR SCROLL",
      updatedAt: null,
      voltaje: "220"
    }
    this.spinnerService.show();
    this.userService.setTab('compresores')
    if (this.compresorStateService.get() && !this.compresorStateService.checkCompresorInProgress()) {
      this.compresor = this.compresorStateService.get();
      this.dataInitialized = true;
    } else {
      if (this.compresorStateService.checkCompresorInProgress()) {
        this.nuevoCompresor();
        this.dataInitialized = true;
      }
    }
    this.spinnerService.hide();
  }

  regresar() {
    this.compresorStateService.turnOffCompresorInProgress();
    this.router.navigateByUrl('home');
  }

  nuevoCompresor() {
    this.editCheck = true;
    this.newCompresorCheck = true;
    this.compresorForm = this.formBuilder.group({
      aplicacion: ['', Validators.required],
      btu: ['', Validators.required],
      conexion: ['', Validators.required],
      createdAt: [],
      desc_prod: ['', Validators.required],
      fases: ['', Validators.required],
      hp: ['', Validators.required],
      id: [],
      modelo: ['', Validators.required],
      refrigerante: ['', Validators.required],
      tipo: ['', Validators.required],
      updatedAt: [],
      voltaje: ['', Validators.required]
    });
  }

  editar() {
    this.editCheck = true;
    this.compresorForm = this.formBuilder.group({
      aplicacion: [this.compresor.aplicacion, Validators.required],
      btu: [this.compresor.btu, Validators.required],
      conexion: [this.compresor.conexion, Validators.required],
      createdAt: [this.compresor.createdAt],
      desc_prod: [this.compresor.desc_prod, Validators.required],
      fases: [this.compresor.fases, Validators.required],
      hp: [this.compresor.hp, Validators.required],
      id: [this.compresor.id],
      modelo: [this.compresor.modelo, Validators.required],
      refrigerante: [this.compresor.refrigerante, Validators.required],
      tipo: [this.compresor.tipo, Validators.required],
      updatedAt: [this.compresor.updatedAt],
      voltaje: [this.compresor.voltaje, Validators.required],
      minimoPresionEvaporacion: [this.compresor.minimoPresionEvaporacion, Validators.required],
      maximoPresionEvaporacion: [this.compresor.maximoPresionEvaporacion, Validators.required],
      minimoTemperaturaEvaporacion: [this.compresor.minimoTemperaturaEvaporacion, Validators.required],
      maximoTemperaturaEvaporacion: [this.compresor.maximoTemperaturaEvaporacion, Validators.required],
      minimoPresionCondensacion: [this.compresor.minimoPresionCondensacion, Validators.required],
      maximoPresionCondensacion: [this.compresor.maximoPresionCondensacion, Validators.required],
      minimoTemperaturaCondensacion: [this.compresor.minimoTemperaturaCondensacion, Validators.required],
      maximoTemperaturaCondensacion: [this.compresor.maximoTemperaturaCondensacion, Validators.required],
      minimoTemperaturaFinal: [this.compresor.minimoTemperaturaFinal, Validators.required],
      maximoTemperaturaFinal: [this.compresor.maximoTemperaturaFinal, Validators.required]
    });
    this.compresorForm.controls.modelo.disable();
  }

  cancelEdit() {
    this.editCheck = false;
    this.compresorForm.reset();
  }

  async submit(type: string) {
    this.validationIssues = false;
    if (type === 'edit') {
      if (this.madeChanges) {
        if (this.compresorForm.valid) {
          try {
            const response = await this.serverService.updateCompresor(this.compresorForm.getRawValue());
            if (response.resp === 'success') {
              this.submitCheck = true;
              this.enableAlert("success", "Cambio realizado!");
              setTimeout(() => {
                this.submitCheck = false;
                this.regresar();
              }, 1250);
            }
          } catch (err) {
            this.enableAlert("error", "Ocurrio un error");
          }
        } else {
          this.validationIssues = true;
          this.enableAlert("error", "Error en el Formulario");
        }
      } else {
        // Alert Pops up
        this.enableAlert("error", "No se realizaron cambios");
      }
    }
    if (type === 'new') {
      if (this.madeChanges) {
        if (this.compresorForm.valid) {
          try {
            const response = await this.serverService.newCompresor(this.compresorForm.getRawValue());
            if (response.resp === 'success') {
              this.submitCheck = true;
              this.enableAlert("success", "Nuevo Compresor!");
              setTimeout(() => {
                this.submitCheck = false;
                this.regresar();
              }, 1250);
            }
            if (response.resp === 'exists') {
              this.enableAlert("error", "Compresor ya existe!");
            }
          } catch (err) {
            this.enableAlert("error", "Ocurrio un error");
          }

        } else {
          this.validationIssues = true;
          this.enableAlert("error", "Error en el Formulario");
        }
      } else {
        // Alert Pops up
        this.enableAlert("error", "No se realizaron cambios");
      }
    }


  }

  change() {
    this.madeChanges = true;
  }

  enableAlert(type: string, message: string) {
    if (!this.showAlert) {
      this.alertType = type
      this.alertMessage = message;
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
        this.alertMessage = "";
        this.alertType = "";
      }, 1250);
    }
  }
}
