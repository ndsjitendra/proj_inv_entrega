import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepState } from 'src/app/shared/interfaces/step';
import config from '../record.config.json';
import * as date_fns from 'date-fns';
import { AddNewValidator } from '../add-new-validator';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { Record } from 'src/app/shared/models/record.model';

@Injectable({
  providedIn: 'root'
})

export class AddNewStateService {

  private _recordModel$: any;
  private _recordForm$: FormGroup;
  private _checklistForm$: FormGroup;
  private _compresor$: Compresor;
  private _compresores$: Compresor[];

  protected _stepState$: BehaviorSubject<StepState>;
  public stepState$: Observable<StepState>;

  recordInProgress: boolean = false;


  get recordModel(): any {
    return this._recordModel$;
  }

  get recordForm(): FormGroup {
    return this._recordForm$;
  }

  get checklistForm(): FormGroup {
    return this._checklistForm$;
  }

  get compresor(): Compresor {
    return this._compresor$;
  }

  get compresores(): Compresor[] {
    return this._compresores$;
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  setRecordModel(data: any) {
    this._recordModel$ = data;
  }

  setCompresor(compresor: Compresor) {
    this._compresor$ = compresor;
  }

  setCompresores(compresores: Compresor[]) {
    this._compresores$ = compresores;
  }

  clearRecordModel() {
    this._recordModel$ = null;
  }

  saveState() {
    this._recordModel$ = this._recordForm$.value;
  }

  startNewRecord() {
    // TODO CHECK FOR EXISTING DRAFT RECORD BEFOREHAND
    this._recordModel$ = new Record();
    this.setCompresor(null);
    this.createForm();
    this.createChecklistForm();
    this.setupStepState('new');
  }

  /*
*
*
* STEP METHODS
* */

  setupStepState(type: string) {
    // TODO CHECK FOR EXISTING DRAFT RECORD BEFOREHAND
    if (type === 'new') {
      this._stepState$ = new BehaviorSubject({
        allSteps: config.Steps,
        currentStep: config.Steps[0],
        stepIndex: 0
      });
    } else {
      this._stepState$ = new BehaviorSubject({
        allSteps: config.Steps,
        currentStep: config.Steps[3],
        stepIndex: 3
      });
    }
    this.stepState$ = this._stepState$.asObservable();
  }

  updateStepState(step: StepState) {
    this._stepState$.next(step);
  }

  /*
  *
 *
 * FORM METHODS
 * */

  resetRecordForm() {
    if (this._recordForm$) {
      this._recordForm$.reset();
    }
  }

  createForm() {
    this._recordForm$ = this.formBuilder.group({
      modelo: [null, Validators.required],
      btu: [null, Validators.required],
      serie: [null, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      hp: [null, Validators.required],
      aplicacion: [null, Validators.required],
      fases: [null, Validators.required],
      refrigerante: [null, Validators.required],
      conexion: [null, Validators.required],
      voltaje: [null, Validators.required],
      // Fin datos compresor
      fechaCompra: [null, Validators.required],
      distribuidor: [null, Validators.required],
      sucursal: [null, Validators.required],
      vendedor: [null, Validators.required],
      factura: [null, Validators.required],
      nombreCliente: [null, Validators.required],
      estadoCliente: [null, Validators.required],
      correoCliente: [null, Validators.compose([Validators.required, Validators.email])],
      telefonoCliente: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      modeloCompresorReemplazarCliente: [null, Validators.required],
      maquinaCliente: [null, Validators.required],
      modeloCompresorCliente: [null, Validators.required],
      checklistComplete: [null, Validators.required],
      presionEvaporacion: [null, Validators.required],
      temperaturaEvaporacion: [null, Validators.required],
      presionCondensacion: [null, Validators.required],
      temperaturaCondensacion: [null, Validators.required],
      temperaturaFinal: [null, Validators.required],
      contactorCapacitor: [null, Validators.required],
      superiorCapacitor: [null, Validators.required],
      compresorSoldado: [null, Validators.required],
      instalacion:[null, Validators.required],
      tipoGarantia: [null, Validators.required],
    });
  }

  fillStep2Values() {
    this._recordForm$.controls.btu.setValue(this.compresor.btu);
    this._recordForm$.controls.hp.setValue(this.compresor.hp);
    this._recordForm$.controls.aplicacion.setValue(this.compresor.aplicacion);
    this._recordForm$.controls.fases.setValue(this.compresor.fases);
    this._recordForm$.controls.refrigerante.setValue(this.compresor.refrigerante);
    this._recordForm$.controls.conexion.setValue(this.compresor.conexion);
    this._recordForm$.controls.voltaje.setValue(this.compresor.voltaje);
    this.saveState();
  }

  resetStep2Values() {
    this._recordForm$.controls.btu.reset();
    this._recordForm$.controls.hp.reset();
    this._recordForm$.controls.aplicacion.reset();
    this._recordForm$.controls.fases.reset();
    this._recordForm$.controls.refrigerante.reset();
    this._recordForm$.controls.conexion.reset();
    this._recordForm$.controls.voltaje.reset();
    this.saveState();
  }


  // Checklist Form

  createChecklistForm() {
    this._checklistForm$ = this.formBuilder.group({
      check1: [null, Validators.required],
      check2: [null, Validators.required],
      check3: [null, Validators.required],
    });
  }

  /*
*
* Compresor Check Step 2
*/

  changedModelData() {
    this.resetStep2Values();
    this.setCompresor(null);
  }

  checkModelData() {
    if (this._recordForm$.controls.modelo.value) {
      if (this.compresores.find(c => c.modelo === this._recordForm$.controls.modelo.value)) {
        const compresor = this.compresores.find(c => c.modelo === this._recordForm$.controls.modelo.value);
        this.setCompresor(compresor);
        this.fillStep2Values();
        return true;
      } else {
        this.setCompresor(null);
        this.resetStep2Values();
        return false;
      }
    } else {
      return false;
    }
  }

  /*
  *
  * Record in Progress Checks
  */
  public turnOnRecordInProgress() {
    this.recordInProgress = true;
  }

  public turnOffRecordInProgress() {
    this.recordInProgress = false;
  }

  public checkRecordInProgress() {
    return this.recordInProgress;
  }

}
