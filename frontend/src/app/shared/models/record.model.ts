import { BaseModel } from './base.model';

export class Record extends BaseModel{
  localId: string;
  username: string;
  nombreTecnico: string;
  matricula: number;
  modelo: string;
  serie: string;
  aplicacion: string;
  fechaCompra: string;
  distribuidor: string;
  sucursal: string;
  vendedor: string;
  factura: string;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  estadoCliente: string;
  modeloCompresorCliente: string;
  modeloCompresorReemplazarCliente: string;
  maquinaCliente: string;
  checklistComplete: boolean;
  createdAt?: string;
  garantia?: string;
  status?: string;
  tipoGarantia?: string;
  garantiaPdf?: string;
  presionEvaporacion: number;
  temperaturaEvaporacion: number;
  presionCondensacion: number;
  temperaturaCondensacion: number;
  temperaturaFinal: number;
  contactorCapacitor: string;
  superiorCapacitor: string;
  compresorSoldado: string;
  instalacion: string;
}
