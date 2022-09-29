import { BaseModel } from './base.model';

export class Compresor extends BaseModel {
  aplicacion: string;
  btu: string;
  conexion: string;
  createdAt: string;
  desc_prod: string;
  fases: string;
  hp: string;
  modelo: string;
  refrigerante: string;
  tipo: string;
  updatedAt: string;
  voltaje: string;
  serie?: string;
  minimoPresionEvaporacion: string;
  maximoPresionEvaporacion: string;
  minimoTemperaturaEvaporacion: string;
  maximoTemperaturaEvaporacion: string;
  minimoPresionCondensacion: string;
  maximoPresionCondensacion: string;
  maximoTemperaturaCondensacion: string;
  minimoTemperaturaCondensacion: string;
  minimoTemperaturaFinal: string;
  maximoTemperaturaFinal: string;
}
