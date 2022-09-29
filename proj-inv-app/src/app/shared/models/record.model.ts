import { Compresor } from './compresor.model';

export class Record {
  username: string;
  nombreTecnico: string;
  matricula: number;
  aplicacion: string;
  compresorModel: string;
  compresorSerial: string;
  fechaCompra: string;
  distribuidor: string;
  factura: string;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  marca: string;
  modeloInstalado: string;
  placa?: string;
  createdAt?: string;
  garantia?: string;
  status?: string;
  presionEvaporacion: number;
  temperaturaEvaporacion: number;
  presionCondensacion: number;
  temperaturaCondensacion: number;
  temperaturaFinal: number;
  id?: number;
}
