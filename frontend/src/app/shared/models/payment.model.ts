import { BaseModel } from './base.model';

export class Payment extends BaseModel {
  idUsername: string;
  localRecordId: string;
  status: string;
  totalAmount: number;
  balance: number;
}
