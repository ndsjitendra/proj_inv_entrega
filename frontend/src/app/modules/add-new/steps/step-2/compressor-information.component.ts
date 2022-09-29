import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AddNewStateService } from '../../services/add-new-state.service';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { Compresor as ConstantCompresor } from '../../../../shared/Constants/compresorConstants';
import * as date_fns from 'date-fns';


@Component({
  selector: 'app-compressor-information',
  templateUrl: './compressor-information.component.html',
  styleUrls: ['./compressor-information.component.scss']
})
export class CompressorInformationComponent implements OnInit, OnDestroy {
  @Input() validationIssues: boolean = false;
  @Input() compresores: Compresor[];
  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;
  compresorConstants = ConstantCompresor;
  modelCheck: boolean = true;
  newDate: Date;
  maxDate: Date;

  get compresor(): Compresor {
    return this.addNewStateService.compresor;
  }

  constructor(
    private addNewStateService: AddNewStateService,
  ) {}

  ngOnInit() {
    this.dataInitialized = false;
    this.newDate = new Date();
    this.maxDate = date_fns.addDays(this.newDate, -60);
    this.addNewForm = this.addNewStateService.recordForm;
    this.formChangesSubscription = this.addNewForm.valueChanges.subscribe(() => {
      this.onFormChanges();
    });

    this.addNewForm.controls.modelo.valueChanges.subscribe((val) => { 
      this.addNewStateService.changedModelData();
    })
    if (this.compresor) {
      this.modelCheck = true;
    }
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
    this.saveState();
  }

  saveState() {
    this.addNewStateService.saveState();
  }

  checkModelData() {
    this.modelCheck = this.addNewStateService.checkModelData();
  }

}
