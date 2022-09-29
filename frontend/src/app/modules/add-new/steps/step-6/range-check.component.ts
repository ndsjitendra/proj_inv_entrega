import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { AddNewStateService } from '../../services/add-new-state.service';


@Component({
  selector: 'app-range-check',
  templateUrl: './range-check.component.html',
  styleUrls: ['./range-check.component.scss']
})
export class RangeCheckComponent implements OnInit, OnDestroy {
  @Input() validationIssues: boolean = false;

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;
  compresor: Compresor;

  constructor(
    private addNewStateService: AddNewStateService,
  ) { }

  ngOnInit() {
    this.dataInitialized = false;
    this.addNewForm = this.addNewStateService.recordForm;
    this.compresor = this.addNewStateService.compresor;
    this.formChangesSubscription = this.addNewForm.valueChanges.subscribe(() => {
      this.onFormChanges();
    });
    this.saveState();
    this.dataInitialized = true;
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
      this.formChangesSubscription = null;
    }
  }

  onFormChanges() {
    this.changeRange();
    this.saveState();
  }


  changeRange() {
    let validRanges = true;

    if (!this.addNewForm.controls.presionEvaporacion.valid || !this.addNewForm.controls.temperaturaEvaporacion.valid || !this.addNewForm.controls.presionCondensacion.valid || !this.addNewForm.controls.temperaturaCondensacion.valid || !this.addNewForm.controls.temperaturaFinal.valid) {
      validRanges = false;
      return;
    }

    if (this.addNewForm.value.presionEvaporacion < this.compresor.minimoPresionEvaporacion || this.addNewForm.value.presionEvaporacion > this.compresor.maximoPresionEvaporacion) {
      validRanges = false;
    }
    if (this.addNewForm.value.temperaturaEvaporacion < this.compresor.minimoTemperaturaEvaporacion || this.addNewForm.value.temperaturaEvaporacion > this.compresor.maximoTemperaturaEvaporacion) {
      validRanges = false;
    }
    if (this.addNewForm.value.presionCondensacion < this.compresor.minimoPresionCondensacion || this.addNewForm.value.presionCondensacion > this.compresor.maximoPresionCondensacion) {
      validRanges = false;
    }
    if (this.addNewForm.value.temperaturaCondensacion < this.compresor.minimoTemperaturaCondensacion || this.addNewForm.value.maximoTemperaturaCondensacion > this.compresor.maximoPresionEvaporacion) {
      validRanges = false;
    }
    if (this.addNewForm.value.temperaturaFinal < this.compresor.minimoTemperaturaFinal || this.addNewForm.value.temperaturaFinal > this.compresor.maximoTemperaturaFinal) {
      validRanges = false;
    }
    if (validRanges) {
      this.addNewForm.controls.tipoGarantia.setValue('total', { emitEvent: false });
    } else {
      this.addNewForm.controls.tipoGarantia.setValue('condicionada', { emitEvent: false });
    }
  }

  deletePhoto(type: string) {
    switch (type) {
      case 'contactorCapacitor':
        this.addNewForm.controls.contactorCapacitor.reset();
        break;
      case 'superiorCapacitor':
        this.addNewForm.controls.superiorCapacitor.reset();
        break;
      case 'compresorSoldado':
        this.addNewForm.controls.compresorSoldado.reset();
        break;
      case 'instalacion':
        this.addNewForm.controls.instalacion.reset();
        break;
    }
    
    this.saveState();
  }

  saveState() {
    this.addNewStateService.saveState();
  }

}
