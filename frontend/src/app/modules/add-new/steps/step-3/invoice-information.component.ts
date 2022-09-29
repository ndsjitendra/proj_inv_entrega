import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AddNewStateService } from '../../services/add-new-state.service';
import { Compresor as ConstantCompresor } from '../../../../shared/Constants/compresorConstants';
import * as date_fns from 'date-fns';
import { Distributor } from 'src/app/shared/models/distributor.model';


@Component({
  selector: 'app-invoice-information',
  templateUrl: './invoice-information.component.html',
  styleUrls: ['./invoice-information.component.scss']
})
export class InvoiceInformationComponent implements OnInit, OnDestroy {
  @Input() validationIssues: boolean = false;
  @Input() distributors: Distributor[] = [];

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;
  compresorConstants = ConstantCompresor;
  newDate: Date;
  maxDate: Date;
  distributor: string[] = [];
  sucursal: string[] = [];

  constructor(
    private addNewStateService: AddNewStateService,
  ) {}

  ngOnInit() {
    this.dataInitialized = false;
    this.newDate = new Date();
    this.maxDate = date_fns.addDays(this.newDate, -60);
    this.addNewForm = this.addNewStateService.recordForm;
    this.distributors.forEach((val) => {
      if (!this.distributor.find(d => d === val.distribuidor)) {
        this.distributor.push(val.distribuidor);
      }
    });
    this.formChangesSubscription = this.addNewForm.valueChanges.subscribe(() => {
      this.onFormChanges();
    });
    this.addNewForm.controls.distribuidor.valueChanges.subscribe((val) => {
      this.checkSucursal();
    })
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

  checkSucursal() {
    this.addNewForm.controls.sucursal.reset();
    this.sucursal = [];
    const filteredDistributors = this.distributors.filter(d => d.distribuidor === this.addNewForm.controls.distribuidor.value);
    filteredDistributors.forEach((d) => {
      this.sucursal.push(d.sucursal);
    });
  }

  deletePhoto() {
    this.addNewForm.controls.factura.reset();
    this.saveState();
  }

}
