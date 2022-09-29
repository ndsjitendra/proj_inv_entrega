import { Injectable } from '@angular/core';
import { Compresor } from '../../models/compresor.model';
import { Record } from '../../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordStateService {

  currentRecord: Record;
  recordInProgress: boolean = false;

  constructor() {
  }

  public set(record: Record) {
    this.currentRecord = record;
  }

  public get() {
    return this.currentRecord;
  }

  public clear() {
    this.currentRecord = null;
  }

  public turnOnRecordInProgress() {
    this.recordInProgress = true;
  }

  public turnOffRecordInProgress() {
    this.recordInProgress = false;
  }

  public checkRecordInProgress() {
    return this.recordInProgress;
  }

}
