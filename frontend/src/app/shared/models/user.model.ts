import { BaseModel } from './base.model';
import { Respuesta, Actividad } from '../Constants/Constants';

export class UserModel extends BaseModel {
  nombre: string;
  apellido: string;
  telefono: string;
  estado: string;
  ciudad: string;
  cp: string;
  calleYnum: string;
  persona: string;
  tarjeta: string;
  banco: string;
  clabe?: string;
  rfc: string;
  actividad: Actividad.Independiente | Actividad.Empresa;
  experiencia: string;
  utilizadoCompresor: Respuesta.Si | Respuesta.No;
  recibirInformacion: Respuesta.Si | Respuesta.Si;
  foto: string;
  tipoDeCuenta: number;
  matricula: number;
  username: string;
  password: string;
  terminosPrivacidad: boolean;
  localId?: string;
}

