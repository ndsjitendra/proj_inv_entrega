
import { FormGroup } from '@angular/forms';
import { Compresor } from 'src/app/shared/models/compresor.model';
import { Record } from 'src/app/shared/models/record.model';
import { ServerService } from 'src/app/shared/services/server-connection/server.services';

export class AddNewValidator {
  constructor(
    private serverService: ServerService
  ) { }

  processValidater(currentStep, form: FormGroup, compresores: Compresor[], compresor: Compresor) {
    switch (currentStep["Key"]) {
      case "R_S_1":
        return this.validateRequiredFields_S1();
      case "R_S_2":
        return this.validateRequiredFields_S2(form, compresores,compresor);
        break;
      case "R_S_3":
        return this.validateRequiredFields_S3(form);
        break;
      case "R_S_4":
        return this.validateRequiredFields_S4(form);
        break;
      case "R_S_5":
        return this.validateRequiredFields_S5(form);
        break;
      case "R_S_6":
        return this.validateRequiredFields_S6(form);
        break;
      default:
        return 'Valid';
    }
  }

  validateRequiredFields_S1() {
    let message = 'Valid';
    return message;
  }
  async validateRequiredFields_S2(form: FormGroup, compresores: Compresor[],compresor: Compresor) {
    let message = 'Valid';

    if (!form.controls.modelo.valid || !form.controls.serie.valid) {
      message = 'Invalid';
      return message;
    }
    if (!compresor) {
      message = 'No se realizo validación de compresor!'
      return message;
    }

    if (!form.controls.hp.valid || !form.controls.aplicacion.valid || !form.controls.fases.valid || !form.controls.refrigerante.valid || !form.controls.conexion.valid || !form.controls.voltaje.valid || !form.controls.btu.valid) {
      message = 'Invalid';
      return message;
    }
    if (!compresores.find(c => c.modelo === form.controls.modelo.value)) {
      message = 'Modelo del compresor no existe!';
      return message;
    }
    const checkSerialValue = {
      modelo: form.value.modelo,
      serie: form.value.serie
    }
    const response = await this.serverService.checkSerial(checkSerialValue);
    if (response.err) {
      message = 'Combinación Modelo/Serial ya existe!'
    }
    return message;
  }

  validateRequiredFields_S3(form: FormGroup) {
    let message = 'Valid';
    if (!form.controls.fechaCompra.valid || !form.controls.distribuidor.valid || !form.controls.sucursal.valid || !form.controls.vendedor.valid  || !form.controls.factura.valid) {
      message = 'Invalid';
    }
    return message;
  }

  validateRequiredFields_S4(form: FormGroup) {
    let message = 'Valid';
    if (!form.controls.nombreCliente.valid || !form.controls.estadoCliente.valid || !form.controls.telefonoCliente.valid || !form.controls.correoCliente.valid || !form.controls.modeloCompresorReemplazarCliente.valid || !form.controls.modeloCompresorCliente.valid || !form.controls.maquinaCliente.valid) {
      message = 'Invalid';
      return message;
    }
    if (!form.controls.telefonoCliente.valid) {
      message = 'Teléfono incorrecto!';
      return message;
    }
    return message;
  }

  validateRequiredFields_S5(form: FormGroup) {
    let message = 'Valid';
    if (!form.value.checklistComplete) {
      message = 'Es necesario aceptar todas las condiciones presentadas!'
    }
    return message;
  }

  validateRequiredFields_S6(form: FormGroup) {
    let message = 'Valid';
    if (!form.controls.presionEvaporacion.valid || !form.controls.temperaturaEvaporacion.valid || !form.controls.presionCondensacion.valid || !form.controls.temperaturaCondensacion.valid || !form.controls.temperaturaFinal.valid  || !form.controls.contactorCapacitor.valid  || !form.controls.superiorCapacitor.valid  || !form.controls.compresorSoldado.valid  || !form.controls.instalacion.valid) {
      message = 'Invalid';
    }
    return message;
  }




}
