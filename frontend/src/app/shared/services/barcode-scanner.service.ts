import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BarcodeScannerService {


  status: any;
  constructor() { }



  async checkPermission() {
    this.status = await BarcodeScanner.checkPermission({ force: true });
    return this.status;
  }

  prepareBarcodeScanner() {
    BarcodeScanner.prepare();
  }

  stopBarcodeScanner() {
    document.body.style.background = "";
    document.body.style.opacity = "1";
    BarcodeScanner.stopScan();
  }

  hideBackground() {
    BarcodeScanner.hideBackground();
    document.body.style.opacity = "0.0";
    document.body.style.background = "transparent";
  }

  showBackground() {
    BarcodeScanner.showBackground();
  }

  async scanQR() {
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      const split = result.content.split(/\n/);
      const scanValue = {
        modelo: split[0],
        serie: split[1]
      };
      this.stopBarcodeScanner();
      return scanValue;
    } else {
      return 'No Compressor Found';
    }
  }

}