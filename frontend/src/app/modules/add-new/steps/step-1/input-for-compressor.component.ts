import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AddNewStateService } from '../../services/add-new-state.service';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { BarcodeScannerService } from 'src/app/shared/services/barcode-scanner.service';


@Component({
  selector: 'app-input-compressor',
  templateUrl: './input-for-compressor.component.html',
  styleUrls: ['./input-for-compressor.component.scss']
})
export class InputCompressorComponent implements OnInit, OnDestroy {
  @Output() openQRHelp: EventEmitter<any> = new EventEmitter();
  @Input() compresores: Compresor[];
  @Input() validationIssues: boolean = false;

  dataInitialized: boolean = false;
  formChangesSubscription: Subscription = null;
  addNewForm: FormGroup;
  scannedQR: boolean = false;
  needQRScanner: boolean = false;
  noCompressorFound: boolean = false;
  scanningQR: boolean = false;


  constructor(
    private addNewStateService: AddNewStateService,
    private barcodeScannerService: BarcodeScannerService,
  ) {

  }

  ngOnInit() {
    this.dataInitialized = false;
    this.barcodeScannerService.prepareBarcodeScanner();
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
    this.barcodeScannerService.stopBarcodeScanner();
  }

  async scanQR() {
    if (this.scanningQR) {
      return;
    }
    this.noCompressorFound = false;
    this.scannedQR = false;
    this.needQRScanner = false;
    this.addNewStateService.resetRecordForm();  

    const status = await this.barcodeScannerService.checkPermission();
    if (status.granted) {
      this.barcodeScannerService.hideBackground();
      this.scanningQR = true;
      const result = await this.barcodeScannerService.scanQR() as any;
      if (result === 'No Compressor Found') {
        this.noCompressorFound = true;
        this.stopBarcodeScanner();
        return;
      }
      this.addNewForm.controls.modelo.setValue(result.modelo);
      this.addNewForm.controls.serie.setValue(result.serie);
      this.scannedQR = true;
      this.scanningQR = false;
      this.stopBarcodeScanner();
      return;
    } else {
      this.needQRScanner = true;
      this.stopBarcodeScanner();
      return;
    }
  }

  openBarcodeScanner() {
    this.barcodeScannerService.hideBackground();
  }

  stopBarcodeScanner() {
    this.barcodeScannerService.stopBarcodeScanner();
    this.barcodeScannerService.showBackground();
  }

  async selectType() {

  }


  onFormChanges() {
    this.saveState();
  }

  saveState() {
    this.addNewStateService.saveState();
  }

  seeQrHelp() {
    this.openQRHelp.emit();
  }
}
