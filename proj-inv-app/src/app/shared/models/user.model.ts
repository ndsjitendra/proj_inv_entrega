import { BaseModel } from './base.model';
import { Respuesta, Actividad } from './Constants';

export class UserModel extends BaseModel {
  nombre: string;
  apellido: string;
  telefono: string;
  estado: string;
  ciudad: string;
  cp: string;
  calleYnum: string;
  persona: string;
  rfc: string;
  tarjeta: string;
  clabe: string;
  actividad: Actividad.Independiente | Actividad.Empresa;
  experiencia: string;
  utilizadoCompresor: Respuesta.Si | Respuesta.No;
  recibirInformacion: Respuesta.Si | Respuesta.Si;
  foto: string;
  tipoDeCuenta: number;
  matricula: number;
  username: string;
  password: string;
  updatedAt?: string;
  createdAt?: string;
}

