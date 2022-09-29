
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { ServerService } from 'src/app/shared/services/server.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadPageComponent implements OnInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  dataType: string;
  file: any;
  showAlert: boolean = false;
  alertType: string;
  alertMessage: string;
  newUserCheck: boolean = false;

  dataToUpload: any;

  uploading: boolean = false;

  /**
 * handle file from browsing
 */
  fileBrowseHandler(file) {
    this.addFile(file.srcElement.files[0]);
  }

  constructor(
    private csvParser: NgxCsvParser,
    private serverService: ServerService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.uploading = false;
  }

  filter(type) {
    this.dataType = type;
  }

  addFile(file) {
    if (file && !file.name.includes('csv')) {
      this.enableAlert("error", "Archivo no tiene el formato csv");
      return;
    }
    this.file = file;
    console.log("FILE", file)
  }

  async uploadFile() {
    this.csvParser.parse(this.file, { header: false, delimiter: ',' }).pipe().subscribe((result: any) => {
      if (result.length > 0) {
        this.uploading = true;
        this.spinnerService.show();
        result.shift();
        const results = result;
        results.forEach((value) => {
          if (this.dataType === 'compresores') {
            const compresor = new Compresor();
            compresor.modelo = value[1];
            compresor.tipo = value[2];
            compresor.aplicacion = value[3];
            compresor.hp = value[4];
            compresor.refrigerante = value[5];
            compresor.conexion = value[6];
            compresor.voltaje = value[7];
            compresor.fases = value[8];
            compresor.btu = value[9];
            compresor.desc_prod = value[10];
            compresor.minimoPresionEvaporacion = value[11];
            compresor.maximoPresionEvaporacion = value[12];
            compresor.minimoTemperaturaEvaporacion = value[13];
            compresor.maximoTemperaturaEvaporacion = value[14];
            compresor.minimoPresionCondensacion = value[15];
            compresor.maximoPresionCondensacion = value[16];
            compresor.minimoTemperaturaCondensacion = value[17];
            compresor.maximoTemperaturaCondensacion = value[18];
            compresor.minimoTemperaturaFinal = value[19];
            compresor.maximoTemperaturaFinal = value[20];
            try {
              this.serverService.newMassCompresor(compresor);
            } catch (err) {
              this.enableAlert("error", "Error en el archivo.");
            }

          }
        });
        this.enableAlert("success", "El archivo se subio de manera exitosa!");
        setTimeout(() => {
          this.uploading = false;
          this.spinnerService.hide();
          this.router.navigateByUrl('home');
        }, 1250)
      } else {
        this.uploading = false;
        this.enableAlert("error", "El archivo no contiene información!");
      }

    })
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

  deleteFile() {
    this.file = null;
  }

}
