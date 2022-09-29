import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AddNewStateService } from '../../services/add-new-state.service';
import { Compresor as ConstantCompresor } from '../../../../shared/Constants/compresorConstants';
import * as date_fns from 'date-fns';
import { Constants } from 'src/app/shared/Constants/Constants';


@Component({
  selector: 'app-client-information',
  templateUrl: './client-information.component.html',
  styleUrls: ['./client-information.component.scss']
})
export class ClientInformationComponent implements OnInit, OnDestroy {
  @Input() validationIssues: boolean = false;

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;
  compresorConstants = ConstantCompresor;
  marcas = [
    'Bitzer',
    'Copeland',
    'Danfoss',
    'Hitachi',
    'LG',
    'Samsung',
    'Sanyo',
    'Trane'
  ];
  newDate: Date;
  maxDate: Date;
  estados: string[] = Constants.estados;

  constructor(
    private addNewStateService: AddNewStateService,
  ) {}

  ngOnInit() {
    this.dataInitialized = false;
    this.addNewForm = this.addNewStateService.recordForm;
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
    this.saveState();
  }

  saveState() {
    this.addNewStateService.saveState();
  }

}
