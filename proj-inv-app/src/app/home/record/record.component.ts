import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Record } from 'src/app/shared/models/record.model';
import { RecordStateService } from 'src/app/shared/services/getItem/record-state.service';
import { ServerService } from 'src/app/shared/services/server.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordPageComponent {
  record: Record;
  dataInitialized: boolean = false;
  madeChanges: boolean = false;
  recordForm: FormGroup;
  editCheck: boolean = false;
  validationIssues: boolean = false;

  recordStatus: string;
  originalStatus: string;

  newRecord: boolean = false;
  dateFormat: "dd/MM/yyyy"

  showAlert: boolean = false;
  alertType: string;
  alertMessage: string;

  newRecordCheck: boolean = false;

  constructor(
    private recordStateService: RecordStateService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dataInitialized = false;
    this.newRecordCheck = false;
    this.editCheck = false;
    let testRecord = {
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
      tipo: "record SCROLL",
      updatedAt: null,
      voltaje: "220"
    }
    this.spinnerService.show();
    this.userService.setTab('registros')
    if (this.recordStateService.get() && !this.recordStateService.checkRecordInProgress()) {
      this.record = this.recordStateService.get();
      this.originalStatus = this.record.status;
      this.recordStatus = this.record.status;
      this.dataInitialized = true;
    } else {
      if (this.recordStateService.checkRecordInProgress()) {
        this.dataInitialized = true;
      }
    }
    this.spinnerService.hide();
  }

  regresar() {
    this.router.navigateByUrl('home');
  }

  nuevoRecord() {
    this.editCheck = true;
    this.newRecordCheck = true;
    this.recordForm = this.formBuilder.group({
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

  cancelEdit() {
    this.editCheck = false;
    this.recordForm.reset();
  }

  async changeStatus() {
    this.spinnerService.show();
    const response = await this.serverService.updateRecordStatus(this.recordStatus, this.record.id);
    if (response.resp === 'success') {
      this.enableAlert("success", "Registro actualizado");
      setTimeout(() => {
        this.spinnerService.hide();
        this.router.navigateByUrl('home');
      }, 1250);
    } else {
      this.enableAlert("error", "Hubo un error");
      this.spinnerService.hide();
    }
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
